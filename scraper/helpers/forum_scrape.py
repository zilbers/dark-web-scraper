import pandas as pd
import glob


# Combines all of the currently scraped data, wil change later to combine with main CSV file \ save on a DB
def forum_scrape(path, file, collums):
    print("\nCombining all CSV files to one...")
    all_csv = glob.glob(path)
    frames = []

    for path in all_csv:
        frames.append(pd.read_csv(path))

    result = pd.concat(frames, ignore_index=True)
    result = result.drop_duplicates(subset=collums)
    result.to_csv(file)
