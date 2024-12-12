import os
import json

def parse_song_file(content):
    """
    Parses a song file into a structured list of lyrics with labels and text.

    Args:
        content (str): The raw content of the song file as a string.

    Returns:
        list: A list of dictionaries, where each dictionary contains 'label' and 'text'.
    """
    # Keywords indicating labels
    LABEL_KEYWORDS = {"chorus", "verse", "tag"}

    # Split the content into lines and initialize result list
    lines = content.splitlines()
    parsed_lyrics = []
    current_label = ""
    current_text = []

    for line in lines:
        # Trim the line to avoid issues with leading/trailing spaces
        line = line.strip()

        if not line:  # Skip empty lines
            # Save the current lyric group before starting a new label
            if current_text:
                parsed_lyrics.append({"label": current_label, "text": current_text})
            current_label = ""
            current_text = []
            continue

        if any(line.lower().startswith(keyword) for keyword in LABEL_KEYWORDS):
            # Save the current lyric group before starting a new one
            if current_text:
                parsed_lyrics.append({"label": current_label, "text": current_text})
            # Start a new lyric group with the detected label
            current_label = line.lower()
            current_text = []
        else:
            # Continue adding lines to the current lyric group
            current_text.append(line)

    # Append the final lyric group
    if current_text:
        parsed_lyrics.append({"label": current_label, "text": current_text})

    return parsed_lyrics

# Process all text files in a directory
def process_directory(directory_path):
    """
    Processes all .txt files in a specified directory using the parse_song_file function.

    Args:
        directory_path (str): The path to the directory containing .txt files.

    Returns:
        dict: A dictionary where keys are filenames and values are parsed song data.
    """
    parsed_files = {}

    for filename in os.listdir(directory_path):
        if filename.endswith(".txt"):
            file_path = os.path.join(directory_path, filename)
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()
                parsed_files[filename] = parse_song_file(content)

    return parsed_files

# Example usage
directory_path = "wsg-songs"  # Replace with your directory path
parsed_data = process_directory(directory_path)

export_obj = {}
for file, data in parsed_data.items():
    print(f"Parsed data for {file}:")
    export_obj[file.strip(".txt")] = data
    print(type(data))

with open("wsg-songs.json", "w") as export_file:
    json.dump(export_obj, export_file)