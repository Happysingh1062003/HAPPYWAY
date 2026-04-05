import { Metadata } from 'next';
import VaultClient from './VaultClient';

export const metadata: Metadata = {
  title: 'Vault | HappyWay',
  description: 'Manage your evidence and documents',
};

// Moving DEMO_EVIDENCE to the Server Component to mimic a database fetch payload.
const DEMO_EVIDENCE = [
  { id: '1', title: 'IEEE Best Paper Award 2024', criterion: 'awards', strength: 'compelling' as const, strengthScore: 88, organization: 'IEEE', date: '2024-06-15', description: 'Best Paper Award at IEEE International Conference on Machine Learning and Applications', aiAnalysis: 'This is a strong piece of evidence for the awards criterion. IEEE is a well-recognized international organization, and a Best Paper Award demonstrates peer-recognized excellence.', aiSuggestions: 'Consider adding the conference acceptance rate and number of submissions. A letter from the program chair would strengthen this further.', fileType: 'application/pdf', fileSize: 2456789 },
  { id: '2', title: 'Nature Machine Intelligence Publication', criterion: 'scholarly_articles', strength: 'compelling' as const, strengthScore: 92, organization: 'Nature Portfolio', date: '2024-03-10', description: 'First-author publication in Nature Machine Intelligence on novel transformer architecture', aiAnalysis: 'Nature Machine Intelligence is one of the highest-impact journals in AI/ML research. First-author publication here is compelling evidence.', aiSuggestions: 'Include citation count, media coverage of the paper, and any follow-up correspondence from other researchers.', fileType: 'application/pdf', fileSize: 1234567 },
  { id: '3', title: 'TechCrunch Feature: AI Pioneer', criterion: 'press', strength: 'solid' as const, strengthScore: 72, organization: 'TechCrunch', date: '2024-01-20', description: 'Featured profile article on TechCrunch discussing contributions to AI safety research', aiAnalysis: 'TechCrunch is a well-known technology publication. The feature article discusses specific contributions, though additional major media would strengthen the case.', aiSuggestions: 'Seek coverage in non-industry publications (NYT, WSJ, BBC) for stronger impact. Include circulation/readership data.', fileType: null, fileSize: null, externalUrl: 'https://techcrunch.com/article-example' },
  { id: '4', title: 'NeurIPS Program Committee Member', criterion: 'judging', strength: 'solid' as const, strengthScore: 68, organization: 'NeurIPS', date: '2024-09-01', description: 'Served as Area Chair for the NeurIPS 2024 conference, reviewing 15 paper submissions', aiAnalysis: 'NeurIPS is a premier ML conference. Serving as an Area Chair demonstrates that peers recognize your expertise in evaluating others\' work.', aiSuggestions: 'Document the number of papers reviewed and your specific role. An invitation letter from the program chairs would be valuable.', fileType: 'application/pdf', fileSize: 567890 },
  { id: '5', title: 'Google DeepMind Senior Research Scientist', criterion: 'critical_role', strength: 'solid' as const, strengthScore: 70, organization: 'Google DeepMind', date: '2023-06-01', description: 'Led a team of 8 researchers on foundational language model safety research', aiAnalysis: 'Google DeepMind is a distinguished organization. Your leadership of a research team demonstrates a critical role.', aiSuggestions: 'Include organization charts showing your position, revenue impact, and letters from supervisors detailing your unique contributions.', fileType: 'application/pdf', fileSize: 3456789 },
  { id: '6', title: 'Patent: Efficient Attention Mechanism', criterion: 'original_contributions', strength: 'compelling' as const, strengthScore: 85, organization: 'USPTO', date: '2024-04-15', description: 'US Patent for a novel efficient attention mechanism that reduces computational cost by 60%', aiAnalysis: 'A granted US patent demonstrates original contribution. The 60% computational cost reduction suggests significant practical impact.', aiSuggestions: 'Include adoption metrics if any companies/projects use this mechanism. Citation of the patent by other patents would strengthen the case.', fileType: 'application/pdf', fileSize: 890123 },
];

export default async function VaultPage() {
  // In a real application, we would await a database fetch here.
  // const evidence = await db.select().from(evidenceItems).where(...)
  
  // This executes securely on the server and passes only the JSON to the client component.
  return <VaultClient initialEvidence={DEMO_EVIDENCE} />;
}
