import mongoose from 'mongoose';

const JwtTokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
});

export default mongoose.model('JwtTokenBlacklistSchema', JwtTokenBlacklistSchema);