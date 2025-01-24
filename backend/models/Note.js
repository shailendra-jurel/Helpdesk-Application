import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

export { NoteSchema }; 
const Note = mongoose.model('Note', NoteSchema);
export default Note;