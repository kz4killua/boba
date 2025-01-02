import type { Notebook } from "@/types";

export function loadNotebooks() {
  const notebooks = localStorage.getItem("notebooks");
  return JSON.parse(notebooks || "[]");
}

export function saveNotebooks(notebooks: Notebook[]) {
  localStorage.setItem("notebooks", JSON.stringify(notebooks));
}