import csv
import glob

files = glob.glob('c:/Users/Fahrezi/Documents/KULIAH/traffic_web/backend/collected_data/*.csv')
categories = {}
counts = [0]*6
total_rows = 0

for f in files:
    with open(f, 'r') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if len(row) < 9:
                continue
            total_rows += 1
            cat = row[2]
            categories[cat] = categories.get(cat, 0) + 1
            counts[0] += int(row[3])
            counts[1] += int(row[4])
            counts[2] += int(row[5])
            counts[3] += int(row[6])
            counts[4] += int(row[7])
            counts[5] += int(row[8])

print('Total rows:', total_rows)
print('Categories:', categories)
print('Totals for cols 3 to 8:', counts)
