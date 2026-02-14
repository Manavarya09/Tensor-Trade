'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPolicy, deletePolicy, getPolicies, Policy, togglePolicy } from '@/lib/api';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingPolicyId, setUpdatingPolicyId] = useState<string | null>(null);

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Unexpected error';

  const aiRecommendations = [
    {
      title: 'Increase Diversification',
      description: 'Your portfolio concentration in tech stocks is above the optimal threshold.',
      impact: 'MEDIUM RISK',
      action: 'Reduce tech allocation by 10%',
      policyType: 'Risk Management',
    },
    {
      title: 'Rebalance Alert',
      description: 'NVDA has grown to 25% of portfolio, exceeding your 20% limit.',
      impact: 'HIGH RISK',
      action: 'Sell 5% to maintain compliance',
      policyType: 'Rebalancing',
    },
    {
      title: 'New Opportunity',
      description: 'Healthcare sector showing strong fundamentals and Shariah compliance.',
      impact: 'GROWTH POTENTIAL',
      action: 'Consider 10% allocation',
      policyType: 'Allocation',
    },
  ];

  const loadPolicies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPolicies();
      setPolicies(response.policies);
    } catch (error: unknown) {
      alert(`Failed to load policies: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  const complianceStats = useMemo(() => {
    const compliant = policies.filter((policy) => policy.status === 'active').length;
    const needsAttention = policies.length - compliant;
    const score = policies.length === 0 ? 100 : Math.round((compliant / policies.length) * 100);
    return { compliant, needsAttention, score };
  }, [policies]);

  const handleCreatePolicy = async () => {
    const name = window.prompt('Policy name', 'Custom Risk Policy');
    if (!name) {
      return;
    }

    const policyType = window.prompt('Policy type', 'Risk Management');
    if (!policyType) {
      return;
    }

    const rulesInput = window.prompt('Rules (comma-separated)', 'Max allocation 20%, Stop loss 7%');
    if (!rulesInput) {
      return;
    }

    const rules = rulesInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (rules.length === 0) {
      alert('Please provide at least one rule.');
      return;
    }

    try {
      await createPolicy({
        name: name.trim(),
        policy_type: policyType.trim(),
        rules,
      });
      await loadPolicies();
      alert('Policy created successfully.');
    } catch (error: unknown) {
      alert(`Failed to create policy: ${getErrorMessage(error)}`);
    }
  };

  const handleApplyRecommendation = async (rec: (typeof aiRecommendations)[number]) => {
    try {
      await createPolicy({
        name: rec.title,
        policy_type: rec.policyType,
        rules: [rec.description, `Action: ${rec.action}`],
      });
      await loadPolicies();
      alert(`Applied recommendation: ${rec.title}`);
    } catch (error: unknown) {
      alert(`Failed to apply recommendation: ${getErrorMessage(error)}`);
    }
  };

  const handleTogglePolicy = async (policyId: string) => {
    try {
      setUpdatingPolicyId(policyId);
      await togglePolicy(policyId);
      await loadPolicies();
    } catch (error: unknown) {
      alert(`Failed to update policy: ${getErrorMessage(error)}`);
    } finally {
      setUpdatingPolicyId(null);
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!window.confirm('Delete this policy?')) {
      return;
    }

    try {
      setUpdatingPolicyId(policyId);
      await deletePolicy(policyId);
      await loadPolicies();
    } catch (error: unknown) {
      alert(`Failed to delete policy: ${getErrorMessage(error)}`);
    } finally {
      setUpdatingPolicyId(null);
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-4 border-black p-6">
          <div>
            <h2 className="text-2xl font-bold uppercase">Portfolio Policies</h2>
            <p className="text-sm mt-1">MANAGE YOUR TRADING RULES AND COMPLIANCE</p>
          </div>
          <Button onClick={handleCreatePolicy}>NEW POLICY</Button>
        </div>

        {/* AI Recommendations */}
        <Card className="p-6 border-8 border-black">
          <h3 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">AI Policy Advisor</h3>
          
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="border-4 border-black p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold uppercase">{rec.title}</h4>
                    <p className="text-sm mt-1">{rec.description}</p>
                  </div>
                  <span className="px-3 py-1 border-2 border-black font-bold text-xs bg-black text-white whitespace-nowrap">
                    {rec.impact}
                  </span>
                </div>
                <div className="border-t-2 border-black pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">ACTION: {rec.action}</span>
                    <Button size="sm" onClick={() => handleApplyRecommendation(rec)}>APPLY</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Policies */}
        <div>
          <h3 className="text-xl font-bold uppercase mb-4">Active Policies</h3>
          {loading && <p className="text-sm font-bold uppercase mb-3">Loading policies...</p>}
          <div className="space-y-4">
            {policies.map((policy) => (
              <Card key={policy.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold uppercase">{policy.name}</h4>
                      <span className={`px-3 py-1 font-bold text-xs border-2 border-black ${policy.status === 'active' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {policy.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-bold">{policy.type.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{policy.performance}</div>
                    <div className="text-xs">PERFORMANCE</div>
                  </div>
                </div>

                <div className="border-t-4 border-black pt-4">
                  <h5 className="font-bold uppercase text-sm mb-3">Rules</h5>
                  <ul className="space-y-2">
                    {policy.rules.map((rule, index) => (
                      <li key={index} className="text-sm border-l-4 border-black pl-3">{rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t-4 border-black pt-4 mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold">LAST MODIFIED: {policy.last_modified}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePolicy(policy.id)}
                      disabled={updatingPolicyId === policy.id}
                    >
                      {policy.status === 'active' ? 'DEACTIVATE' : 'ACTIVATE'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePolicy(policy.id)}
                      disabled={updatingPolicyId === policy.id}
                    >
                      DELETE
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <Card className="p-6">
          <h3 className="text-xl font-bold uppercase mb-6 border-b-4 border-black pb-3">Compliance Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-4 border-black p-4">
              <div className="text-3xl font-bold">{complianceStats.compliant}</div>
              <div className="text-sm font-bold uppercase mt-1">Compliant</div>
            </div>
            <div className="border-4 border-black p-4">
              <div className="text-3xl font-bold">{complianceStats.needsAttention}</div>
              <div className="text-sm font-bold uppercase mt-1">Needs Attention</div>
            </div>
            <div className="border-4 border-black p-4">
              <div className="text-3xl font-bold">{complianceStats.score}%</div>
              <div className="text-sm font-bold uppercase mt-1">Overall Score</div>
            </div>
          </div>
        </Card>
      </div>
  );
}
