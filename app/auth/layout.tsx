export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-shell min-h-screen">{children}</div>;
}
