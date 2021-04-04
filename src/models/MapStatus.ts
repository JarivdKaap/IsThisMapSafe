import { Document, Model, model, Types, Schema, Query } from 'mongoose';
import MapSecureStatus from './MapSecureStatus';

const MapStatusSchema = new Schema({
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

  mapSecureStatus: {
    type: String,
    enum: MapSecureStatus
  },
  statusChangedDate: Date
});

interface IMapStatusSchema extends Document {
  name: string;
  creatorName: string;
  steamid: number;
  imageUrl: string;
  mapSecureStatus: MapSecureStatus;
  statusChangedDate: Date;
}

// Virtuals and methods

interface IMapStatusBase extends IMapStatusSchema {
  // Add virtuals and methods here
}

export interface IMapStatus extends IMapStatusBase {
  // Add reference properties here
}

// Static methods

export interface IMapStatusModel extends Model<IMapStatus> {
  // Add static models here
}

export default model<IMapStatus & IMapStatusModel>('MapStatus', MapStatusSchema);

