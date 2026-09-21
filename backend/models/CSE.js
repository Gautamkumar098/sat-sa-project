import mongoose from 'mongoose';
const cseSchema=new mongoose.Schema({cse_id:{type:String,unique:true},sector:String,size_bucket:String,peer_group:String,supervisory_score:Number,status:String},{timestamps:true});
export default mongoose.model('CSE',cseSchema);
