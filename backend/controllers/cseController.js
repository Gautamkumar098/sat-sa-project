import CSE from '../models/CSE.js';
const demo=[{cse_id:'CSE-001',sector:'Energy',size_bucket:'L',peer_group:'Energy-L',supervisory_score:92,status:'Critical'},{cse_id:'CSE-002',sector:'Finance',size_bucket:'M',peer_group:'Finance-M',supervisory_score:61,status:'High'},{cse_id:'CSE-003',sector:'Telecom',size_bucket:'L',peer_group:'Telecom-L',supervisory_score:35,status:'Moderate'}];
export async function listCSEs(req,res){try{const rows=await CSE.find().sort({supervisory_score:-1}).lean();res.json(rows.length?rows:demo)}catch{res.json(demo)}}
export async function getCSE(req,res){try{const row=await CSE.findOne({cse_id:req.params.id}).lean();res.json(row||demo.find(x=>x.cse_id===req.params.id)||null)}catch{res.json(demo.find(x=>x.cse_id===req.params.id)||null)}}
