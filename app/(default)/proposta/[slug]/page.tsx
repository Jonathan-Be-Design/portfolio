import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProposal, proposals } from '../../../proposals';
import ProposalPage from '../../../proposal-page';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return proposals.map(proposal => ({ slug: proposal.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const proposal = getProposal(slug);
  if (!proposal) return {};
  return {
    title: `Proposta · ${proposal.project} | Jonathan Bolanle`,
    description: `Proposta comercial para ${proposal.client}.`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const proposal = getProposal(slug);
  if (!proposal) notFound();
  return <ProposalPage proposal={proposal} />;
}
