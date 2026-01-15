/**
 * 🌳 Strategic Work Product Enhancement Framework Data
 * (W/E/P/V Hierarchy)
 */
function MASTER_loadFrameworkData() {
  return [
    {
      code: 'W', title: 'Work Product Analysis',
      children: [
        {
          code: 'W1', title: 'Comprehensive Assessment',
          children: [
            { code: 'W11', title: 'Scope Mapping', children: [
                { code: 'W111', title: 'Core Function Inventory' },
                { code: 'W112', title: 'Capability Boundary Mapping' },
                { code: 'W113', title: 'Implicit Potential Detection' },
                { code: 'W114', title: 'Dependency Analysis' }
            ]},
            { code: 'W12', title: 'Quality Evaluation', children: [
                { code: 'W121', title: 'Clarity Assessment' },
                { code: 'W122', title: 'Consistency Audit' },
                { code: 'W123', title: 'Completeness Check' },
                { code: 'W124', title: 'Error Susceptibility Scan' }
            ]}
          ]
        },
        {
          code: 'W2', title: 'Structural Examination',
          children: [
            { code: 'W21', title: 'Architecture Analysis', children: [
                { code: 'W211', title: 'Component Hierarchy Review' },
                { code: 'W212', title: 'Information Flow Mapping' },
                { code: 'W213', title: 'Modularity Assessment' },
                { code: 'W214', title: 'Interconnection Analysis' }
            ]},
            { code: 'W22', title: 'Organization Efficiency', children: [
                { code: 'W221', title: 'Redundancy Detection' },
                { code: 'W222', title: 'Gap Identification' },
                { code: 'W223', title: 'Sequence Optimization' },
                { code: 'W224', title: 'Accessibility Evaluation' }
            ]}
          ]
        }
      ]
    },
    {
      code: 'E', title: 'Enhancement Discovery',
      children: [
        {
          code: 'E1', title: 'Gap Analysis',
          children: [
            { code: 'E11', title: 'Missing Capabilities', children: [
                { code: 'E111', title: 'Essential Omissions' },
                { code: 'E112', title: 'Convenience Enhancements' },
                { code: 'E113', title: 'Power User Features' },
                { code: 'E114', title: 'Edge Case Handling' }
            ]},
            { code: 'E12', title: 'Depth Opportunities', children: [
                { code: 'E121', title: 'Shallow Treatment Areas' },
                { code: 'E122', title: 'Unexplored Branches' },
                { code: 'E123', title: 'Clarification Needs' },
                { code: 'E124', title: 'Example Deficiencies' }
            ]}
          ]
        },
        {
          code: 'E2', title: 'Optimization Potential',
          children: [
            { code: 'E21', title: 'Efficiency Improvements', children: [
                { code: 'E211', title: 'Process Streamlining' },
                { code: 'E212', title: 'Resource Reduction' },
                { code: 'E213', title: 'Speed Enhancements' },
                { code: 'E214', title: 'Cognitive Load Reduction' }
            ]},
            { code: 'E22', title: 'Quality Elevation', children: [
                { code: 'E221', title: 'Precision Refinement' },
                { code: 'E222', title: 'Robustness Strengthening' },
                { code: 'E223', title: 'Elegance Enhancement' },
                { code: 'E224', title: 'Impact Amplification' }
            ]}
          ]
        },
        {
          code: 'E3', title: 'Innovation Opportunities',
          children: [
            { code: 'E31', title: 'Capability Extension', children: [
                { code: 'E311', title: 'New Feature Possibilities' },
                { code: 'E312', title: 'Integration Expansions' },
                { code: 'E313', title: 'Format Diversification' },
                { code: 'E314', title: 'Application Broadening' }
            ]},
            { code: 'E32', title: 'Paradigm Advancement', children: [
                { code: 'E321', title: 'Methodology Upgrades' },
                { code: 'E322', title: 'Technology Leverage' },
                { code: 'E323', title: 'Best Practice Adoption' },
                { code: 'E324', title: 'Future-Ready Features' }
            ]}
          ]
        }
      ]
    },
    {
      code: 'P', title: 'Proposal Development',
      children: [
        {
          code: 'P1', title: 'Enhancement Prioritization',
          children: [
            { code: 'P11', title: 'Impact Assessment', children: [
                { code: 'P111', title: 'Value Magnitude Estimation' },
                { code: 'P112', title: 'Reach Calculation' },
                { code: 'P113', title: 'Dependency Mapping' },
                { code: 'P114', title: 'Risk Evaluation' }
            ]},
            { code: 'P12', title: 'Feasibility Analysis', children: [
                { code: 'P121', title: 'Implementation Complexity' },
                { code: 'P122', title: 'Resource Requirements' },
                { code: 'P123', title: 'Integration Challenges' },
                { code: 'P124', title: 'Timeline Estimation' }
            ]}
          ]
        },
        {
          code: 'P2', title: 'Recommendation Formulation',
          children: [
            { code: 'P21', title: 'Enhancement Specification', children: [
                { code: 'P211', title: 'Clear Description' },
                { code: 'P212', title: 'Rationale Articulation' },
                { code: 'P213', title: 'Expected Outcome Definition' },
                { code: 'P214', title: 'Success Criteria' }
            ]},
            { code: 'P22', title: 'Implementation Guidance', children: [
                { code: 'P221', title: 'Approach Recommendation' },
                { code: 'P222', title: 'Step-by-Step Outline' },
                { code: 'P223', title: 'Resource Specification' },
                { code: 'P224', title: 'Risk Mitigation' }
            ]}
          ]
        }
      ]
    },
    {
      code: 'V', title: 'Validation Protocol',
      children: [
        {
          code: 'V1', title: 'Justification Verification',
          children: [
            { code: 'V11', title: 'Reasoning Quality', children: [
                { code: 'V111', title: 'Logic Soundness Check' },
                { code: 'V112', title: 'Evidence Support Assessment' },
                { code: 'V113', title: 'Assumption Transparency' },
                { code: 'V114', title: 'Alternative Consideration' }
            ]},
            { code: 'V12', title: 'Alignment Confirmation', children: [
                { code: 'V121', title: 'Goal Congruence' },
                { code: 'V122', title: 'Constraint Respect' },
                { code: 'V123', title: 'Value Consistency' },
                { code: 'V124', title: 'Stakeholder Benefit' }
            ]}
          ]
        },
        {
          code: 'V2', title: 'Impact Projection',
          children: [
            { code: 'V21', title: 'Outcome Modeling', children: [
                { code: 'V211', title: 'Positive Effect Estimation' },
                { code: 'V212', title: 'Potential Drawback Identification' },
                { code: 'V213', title: 'Cascading Impact Analysis' },
                { code: 'V214', title: 'Long-term Consideration' }
            ]}
          ]
        }
      ]
    }
  ];
}
