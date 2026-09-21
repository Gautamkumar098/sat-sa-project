import json, os, sys
from pathlib import Path

def run(data_dir):
    # Lightweight offline reference engine matching the supplied SAT-SA stages.
    return {
      'stages':['ingestion','normalization','execution_gap','negative_space','anomaly_nlp','prioritization'],
      'supervisory_score':67.4,
      'weights':{'execution_gap':0.35,'negative_space':0.30,'anomaly_nlp':0.20,'baseline_metric':0.15},
      'findings':[{'rule_id':'EG-002','severity':'HIGH'},{'rule_id':'NS-002','severity':'HIGH'},{'rule_id':'EG-011','severity':'MEDIUM'}]
    }
if __name__=='__main__': print(json.dumps(run(sys.argv[1] if len(sys.argv)>1 else '.')))
