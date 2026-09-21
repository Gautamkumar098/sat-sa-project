import mongoose from 'mongoose';
const findingSchema=new mongoose.Schema({cse_id:String,rule_id:String,engine:String,severity:String,explanation:String,score:Number},{timestamps:true});
export default mongoose.model('Finding',findingSchema);
