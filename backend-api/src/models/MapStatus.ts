import { Document, Model, model, Types, Schema, Query } from 'mongoose';
import MapSecureStatus from './MapSecureStatus';
import MessageStatus from './MessageStatus';

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
    enum: MapSecureStatus,
    default: MapSecureStatus.Validating,
  },

  modReviewStatus: {
    type: String,
    enum: MapSecureStatus,
  },

  statusMessages: [
    {
      status: {
        type: String,
        enum: MessageStatus,
        required: true,
        default: MessageStatus.Safe,
      },
      message: {
        type: String,
        required: true,
      }
    }
  ],

  statusChangedDate: Date,
  validationHash: String,
  modNotes: String,
});

interface IMapStatusSchema extends Document {
  name: string;
  creatorName: string;
  steamid: number;
  imageUrl: string;
  mapSecureStatus: MapSecureStatus;
  modReviewStatus: MapSecureStatus;
  statusChangedDate: Date;
  statusMessages: {
    status: MessageStatus,
    message: string,
  }[],
  validationHash: string,
  modNotes: string,
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

