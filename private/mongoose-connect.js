import mongoose from 'mongoose';

// single mongo connection
const connectMongo = ({ mongoUrl, newUrlParser }) => mongoose.connect(mongoUrl, newUrlParser);

export default connectMongo;
export { connectMongo };
