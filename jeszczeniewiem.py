import requests
from bs4 import BeautifulSoup
import tkinter as tk
from tkinter import scrolledtext

class SimpleBrowser:
    def __init__(self, root):
        self.history = []  # Lista do przechowywania historii odwiedzanych stron
        self.current_page = -1  # Indeks strony w historii

        # Konfiguracja głównego okna
        self.window = root
        self.window.title("Prosta przeglądarka HTML")
        self.window.geometry("800x600")

        # Pole do wprowadzania URL-a
        self.entry_label = tk.Label(self.window, text="Wprowadź URL:")
        self.entry_label.pack(pady=5)
        self.entry = tk.Entry(self.window, width=50)
        self.entry.insert(0, "https://example.com")  # Domyślny URL
        self.entry.pack(pady=5)

        # Przycisk do pobrania i wyświetlenia treści strony
        self.fetch_button = tk.Button(self.window, text="Pobierz i wyświetl", command=self.fetch_and_display)
        self.fetch_button.pack(pady=10)

        # Przycisk nawigacji wstecz
        self.back_button = tk.Button(self.window, text="Wstecz", command=self.go_back, state=tk.DISABLED)
        self.back_button.pack(side=tk.LEFT, padx=10)

        # Przycisk nawigacji do przodu
        self.forward_button = tk.Button(self.window, text="Do przodu", command=self.go_forward, state=tk.DISABLED)
        self.forward_button.pack(side=tk.LEFT, padx=10)

        # Pole tekstowe z przewijaniem do wyświetlania HTML
        self.text_area = scrolledtext.ScrolledText(self.window, wrap=tk.WORD, width=100, height=30)
        self.text_area.pack(pady=10)

    def fetch_and_display(self):
        url = self.entry.get()
        try:
            # Pobieramy stronę
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Obsługa stylów: nagłówki i pogrubienia
            html_content = ""
            for tag in soup.find_all(['h1', 'h2', 'strong', 'b', 'p']):
                if tag.name in ['h1', 'h2']:
                    html_content += f"\n\n{'#' * (int(tag.name[1]))} {tag.get_text(strip=True)}\n"
                elif tag.name in ['strong', 'b']:
                    html_content += f"**{tag.get_text(strip=True)}** "
                else:
                    html_content += f"{tag.get_text(strip=True)}\n"

            # Zaktualizowanie historii nawigacji
            if self.current_page == -1 or url != self.history[self.current_page]:
                self.history.append(url)
                self.current_page += 1
            self.update_navigation_buttons()

            # Wyświetlanie przetworzonego HTML
            self.text_area.delete(1.0, tk.END)
            self.text_area.insert(tk.END, html_content)

        except requests.exceptions.RequestException as e:
            # Obsługa błędów połączenia
            self.text_area.delete(1.0, tk.END)
            self.text_area.insert(tk.END, f"Wystąpił błąd podczas łączenia: {e}")

    def go_back(self):
        if self.current_page > 0:
            self.current_page -= 1
            self.entry.delete(0, tk.END)
            self.entry.insert(0, self.history[self.current_page])
            self.fetch_and_display()
            self.update_navigation_buttons()

    def go_forward(self):
        if self.current_page < len(self.history) - 1:
            self.current_page += 1
            self.entry.delete(0, tk.END)
            self.entry.insert(0, self.history[self.current_page])
            self.fetch_and_display()
            self.update_navigation_buttons()

    def update_navigation_buttons(self):
        # Aktywuj/dezaktywuj przyciski w zależności od dostępności historii
        self.back_button.config(state=tk.NORMAL if self.current_page > 0 else tk.DISABLED)
        self.forward_button.config(state=tk.NORMAL if self.current_page < len(self.history) - 1 else tk.DISABLED)

# Tworzenie i uruchomienie aplikacji
if __name__ == "__main__":
    root = tk.Tk()
    app = SimpleBrowser(root)
    root.mainloop()