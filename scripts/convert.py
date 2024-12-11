import os
import json
from bs4 import BeautifulSoup


metadata = json.load(open("metadata.json"))
book_map = {}
for book in metadata["books"]:
    book_map[book["usfm"]] = book["human"].lower()


def parse_html_to_json(html_data):
    soup = BeautifulSoup(html_data, 'html.parser')
    book_data = []

    # Find all chapters in the book
    for chapter_div in soup.find_all('div', class_='chapter'):
        chapter_data = {}
        chapter_number = chapter_div.find('div', class_='label').text.strip()
        chapter_data['chapter'] = chapter_number
        chapter_data['verses'] = {}

        # Find heading for the chapter if exists
        heading = chapter_div.find('span', class_='heading')
        if heading:
            chapter_data['heading'] = heading.text.strip()

        # Find all verses
        latest_verse = ""
        for verse_span in chapter_div.find_all('span', class_='verse'):
            label_span = verse_span.find('span', class_='label')
            verse_number = label_span.text.strip() if label_span else None
            if verse_number and verse_number.isnumeric():
                latest_verse = verse_number
                is_continued = False
            else:
                verse_number = latest_verse
                is_continued = True

            # Get verse content and exclude reference markers (e.g., marked by '#')
            verse_content = ''.join(
                content.text for content in verse_span.find_all('span', class_='content')
            ).strip()
            # if latest_verse == "23":
            #     print(verse_number, verse_content)

            # # Clean up any reference notes that might exist
            # verse_content_cleaned = ' '.join(
            #     verse_content.split()
            # )  # Remove extra spaces between words

            if is_continued:
                context = chapter_data['verses'][verse_number]
                chapter_data['verses'][verse_number] = context + " " + verse_content # verse_content_cleaned
            else:
                chapter_data['verses'][verse_number] = verse_content # verse_content_cleaned 

        book_data.append(chapter_data)

    return book_data


def traverse_directory(directory, output_type='separate'):
    """Traverse the directory and convert Bible data to JSON."""
    bible_data = {}

    for root, dirs, files in os.walk(directory):
        for file in files:
            book_id = file.split(".")[0]  # Folder name is the book
            book_name = book_map[book_id]
            file_path = os.path.join(root, file)

            if book_name not in bible_data:
                bible_data[book_name] = {}
    
            print(file_path)
            file_data = parse_html_to_json(open(file_path).read())
            
            for chapter in file_data:
                chapter_number = chapter["chapter"]
                # if (chapter["heading"]) == "Abraham and Keturah":
                #     print(file_data)
                bible_data[book_name][chapter_number] = chapter["verses"]
        break

    if output_type == 'single':
        # Save all Bible data in a single JSON file
        with open('bible_data.json', 'w') as output_file:
            json.dump(bible_data, output_file, indent=4)
    elif output_type == 'separate':
        # Save each book's data in separate files
        for book_name, chapters in bible_data.items():
            output_path = os.path.join('output', book_name)
            os.makedirs(output_path, exist_ok=True)
            for chapter_num, verses in chapters.items():
                output_file = os.path.join(output_path, f'{chapter_num}.json')
                with open(output_file, 'w') as chapter_file:
                    json.dump({chapter_num: verses}, chapter_file, indent=4)

if __name__ == "__main__":
    directory = './download/NKJV'  # Update with the path to your Bible files
    traverse_directory(directory, output_type='single')  # Change to 'single' if you want one file
