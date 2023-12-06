import { Metadata } from 'next';
import {getItemProtests,getItem} from '@/lib/data'
import { items } from "@/types/items";
import { protest } from "@/types/protest";
import { protestTable } from "@/types/protestTable";
import {getItemProtestList} from '@/lib/data'
import ProtestList from "@/components/Protest/ProtestList"
import { promises as fs } from 'fs';

export const metadata: Metadata = {
  title: 'DNTrademark Admin - Domain Items',
  description: 'dntrademark.com is a SaaS platform designed to provide an efficient and user-friendly way to check domain names against global trademark databases.',
  // other metadata
};

const page = async({ params }: { params: { id: number} }) => {
  // const file = await fs.readFile(process.cwd() + '/app/data/trademark_template.txt', 'utf8');
  const file = `[Your Name]
  [Your Email Address]
  [Date]

  Commissioner for Trademarks
  United States Patent and Trademark Office
  P.O. Box 1451
  Alexandria, VA 22313-1451 

  Re: Letter of Protest for Application Serial Number [Application Number] 

  Dear Commissioner for Trademarks,

  I am writing to formally oppose the registration of the trademark identified by application number [Application Number], which was filed by [Applicant Name], [Applicant Label] on [Date of Application]. This opposition is based on the grounds of [state the grounds for opposition, such as likelihood of confusion, dilution, or any other valid reason].

  [Explain in detail the reasons for your opposition. Provide specific examples, evidence, or arguments to support your case. Be concise and clear in presenting your opposition.]

  I believe that granting registration to the aforementioned trademark would [explain the potential harm or confusion that may arise if the trademark is registered].

  In light of the above, I kindly request that the United States Patent and Trademark Office thoroughly reviews and considers the merits of this opposition before proceeding with the registration process. I am prepared to provide any additional information or evidence necessary to support my case.

  Please inform me of any further steps or actions required from my end to ensure that this opposition is processed effectively. You can reach me at [Your Email Address] if you require any clarification or additional information.

  Thank you for your attention to this matter. I look forward to a fair and thorough review of my opposition to trademark application [Application Number].

  Sincerely,

  [Your Name]

  Please consult with a legal professional or trademark attorney to ensure that your letter of protest complies with all legal requirements and regulations in your jurisdiction.`
  const id = params.id

  const item = await getItem(id);
  const items  = item as items;

  const itemProtests = await getItemProtestList(id);
  const protests  = itemProtests as protestTable
  return (
    <ProtestList domainItems={item} id={params.id} template={file} tData={protests} />
  )

  
}

export default page