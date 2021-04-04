import { Document, Model, model, Types, Schema, Query } from 'mongoose';

const MapRequestSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },

  steamid: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },

  imageUrl: String,

  requestDate: {
    type: Date,
    default: Date.now
  },
});

interface IMapRequestSchema extends Document {
  name: string;
  creatorName: string;
  steamid: number;
  imageUrl: string;
  requestDate: Date;
}

// Virtuals and methods

interface IMapRequestBase extends IMapRequestSchema {
  // Add virtuals and methods here
}

export interface IMapRequest extends IMapRequestBase {
  // Add reference properties here
}

// Static methods

export interface IMapRequestModel extends Model<IMapRequest> {
  // Add static models here
}

export default model<IMapRequest & IMapRequestModel>('MapRequest', MapRequestSchema);

