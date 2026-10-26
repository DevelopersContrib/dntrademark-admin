#!/usr/bin/env npx tsx
/**
 * Tests for the OAuth 401-fallback fix in authorizeOAuthUser.
 *
 * Mocks axios.post/get before auth-api is loaded, so no real HTTP calls are made.
 *
 * Verifies:
 *  1. Derived-password 401 + legacy-password 200 → ok:true
 *  2. Both passwords 401 → reason 'account_not_linked'
 *  3. Network error on derived-password → reason 'api_error'
 *  4. 5xx through authorizeOAuthUser → reason 'api_error'
 *  5. 403/422 treated as rejected credentials (not api_error)
 *
 * Usage:  pnpm test:oauth-fallback
 */

import assert from 'node:assert/strict';
import axios, { AxiosError } from 'axios';

process.env.API_URL = 'https://api.test.local';
process.env.API_KEY = 'test-key';
process.env.OAUTH_PASSWORD_SECRET = 'test-secret-that-is-at-least-32-characters-long!!';
process.env.OAUTH_LEGACY_LOGIN = 'true';

type PostCall = { url: string; data: unknown };
const postCalls: PostCall[] = [];

let postHandler: (url: string, data: unknown) => unknown = () => ({});

function makeAxiosError(status: number, message = 'Error') {
  return new AxiosError(
    `Request failed with status code ${status}`,
    status >= 500 ? 'ERR_BAD_RESPONSE' : 'ERR_BAD_REQUEST',
    undefined,
    undefined,
    { status, data: { message }, statusText: message, headers: {}, config: {} as any } as any,
  );
}

const originalPost = axios.post.bind(axios);
const originalGet = axios.get.bind(axios);

(axios as any).post = async (url: string, data: unknown, _config?: unknown) => {
  postCalls.push({ url, data });
  return postHandler(url, data);
};

(axios as any).get = async (_url: string) => {
  return {
    data: {
      success: true,
      data: { data: { id: '42', first_name: 'Test', email: 'user@example.com' } },
    },
  };
};

function resetMocks() {
  postCalls.length = 0;
}

async function main() {
  const { authorizeOAuthUser } = await import('../lib/auth-api.js');
  const { deriveOAuthPassword } = await import('../lib/oauth-password.js');

  // Test 1: derived-password 401, legacy-password 200 → ok:true
  {
    console.log('Test 1: derived-password 401, legacy-password 200 → ok:true');
    resetMocks();
    const derivedPw = deriveOAuthPassword('user@example.com')!;
    assert.ok(derivedPw, 'derived password should exist');

    let callIndex = 0;
    postHandler = (_url: string, data: unknown) => {
      callIndex++;
      const params = data instanceof URLSearchParams ? Object.fromEntries(data) : data as Record<string, string>;
      if (callIndex === 1) {
        assert.equal(params.password, derivedPw, 'First call should use derived password');
        throw makeAxiosError(401, 'Unauthorized');
      }
      assert.equal(params.password, 'user@example.com', 'Second call should use legacy password');
      return { data: { token: '1|abc123hash', data: { id: '42', email: 'user@example.com' } } };
    };

    const result = await authorizeOAuthUser('user@example.com', 'Test User');

    assert.equal(result.ok, true, 'Should succeed via legacy fallback');
    if (result.ok) {
      assert.ok(result.token, 'Should have a token');
      assert.equal(result.token, 'abc123hash', 'Token should be normalized (pipe-stripped)');
    }
    assert.equal(postCalls.length, 2, 'Should have made 2 login attempts');
    console.log('  PASS');
  }

  // Test 2: both passwords 401 → account_not_linked
  {
    console.log('Test 2: both passwords 401 → account_not_linked');
    resetMocks();

    postHandler = () => {
      throw makeAxiosError(401, 'Unauthorized');
    };

    const result = await authorizeOAuthUser('user@example.com', 'Test User');

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, 'account_not_linked', 'Both rejected → account_not_linked');
    }
    assert.equal(postCalls.length, 2, 'Should have tried both passwords');
    console.log('  PASS');
  }

  // Test 3: network error → api_error
  {
    console.log('Test 3: network error → api_error');
    resetMocks();

    postHandler = () => {
      const err = new Error('connect ECONNREFUSED 127.0.0.1:443');
      (err as any).code = 'ECONNREFUSED';
      throw err;
    };

    const result = await authorizeOAuthUser('user@example.com', 'Test User');

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, 'api_error', 'Network error → api_error');
    }
    assert.equal(postCalls.length, 1, 'Should stop after first network error');
    console.log('  PASS');
  }

  // Test 4: 5xx → api_error
  {
    console.log('Test 4: 5xx → api_error');
    resetMocks();

    postHandler = () => {
      throw makeAxiosError(500, 'Internal Server Error');
    };

    const result = await authorizeOAuthUser('user@example.com', 'Test User');

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, 'api_error', '500 → api_error');
    }
    assert.equal(postCalls.length, 1, 'Should stop after 5xx');
    console.log('  PASS');
  }

  // Test 5: 403/422 treated as rejected credentials
  {
    console.log('Test 5: 403/422 treated as rejected credentials');
    resetMocks();

    let callIndex = 0;
    postHandler = () => {
      callIndex++;
      if (callIndex === 1) throw makeAxiosError(403, 'Forbidden');
      throw makeAxiosError(422, 'Unprocessable');
    };

    const result = await authorizeOAuthUser('user@example.com', 'Test User');

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, 'account_not_linked', '403+422 → account_not_linked');
    }
    console.log('  PASS');
  }

  console.log('\nAll OAuth fallback tests passed.');
}

main()
  .catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
  })
  .finally(() => {
    (axios as any).post = originalPost;
    (axios as any).get = originalGet;
  });
