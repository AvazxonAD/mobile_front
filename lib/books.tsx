import { BASE_URL } from "./API";
import { removeBookUrl } from "./utils";

export interface Book {
  id: number;
  title: string;
  description: string;
  image_url: string;
  file_name: string;
  file_size: string;
  created_at: string;
  updated_at: string;
}

const BASE_URLL = BASE_URL + "/books";

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(BASE_URLL);
  const data = await res.json();
  return data.data;
}

export async function deleteBook(id: number) {
  return fetch(`${BASE_URLL}/${id}`, { method: "DELETE" });
}

export async function uploadBook(formData: FormData) {
  return fetch(BASE_URLL, {
    method: "POST",
    body: formData,
  });
}

export function getBookFile(fileName: string) {
  return `${BASE_URLL}/file/${fileName}`;
}

export function getBookImage(imageName: string) {
  return `${BASE_URLL}/file/${removeBookUrl(imageName)}`;
}

export async function createBook(data: {
  title: string;
  description: string;
  image: File;
  pdf: File;
}) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("image", data.image);
  formData.append("pdf", data.pdf);

  const res = await fetch(BASE_URLL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Server error:", errorText);
    throw new Error("Kitobni yuklashda xatolik yuz berdi");
  }

  return res.json();
}
