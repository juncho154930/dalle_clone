import FileSaver from 'file-saver'

import { surpriseMePrompts } from "../constants";

export function getRandomPrompt(prompt: string) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if(randomPrompt === prompt) getRandomPrompt(prompt)

  return randomPrompt
}

export async function downloadImage(_id: string, photo: string | Blob) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`)
}
