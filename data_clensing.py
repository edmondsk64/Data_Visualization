import csv
import json
import pandas as pd

with open('orginal_dataset.csv', 'r') as f:
    reader = csv.reader(f)
    input_list = list(reader)


isFirst = False
print (len(input_list))
for line in input_list:
    if isFirst:
        # convert the id to integer
        line[0] = int(line[0])

        # add group as prefix
        group_name = line[3][-1]
        line[1] = group_name + "." + line[1]

    else:
        isFirst = True

isFirst = False
for line in input_list:
    if isFirst:
        
        # convert sting to int list
        line[2] = [int(x) for x in line[2].split(",")]

        # remove out of bound data
        dels = [i for i, val in enumerate(line[2]) if val > len(input_list)]
        del line[2][dels[0]: dels[-1] + 1]

        # convert client id to name
        for index, client_id in enumerate(line[2]):
            temp = line[2]
            if(client_id <= len(input_list)):
                line[2][index] = input_list[client_id][1]

    else:
        isFirst = True

result = ''.join(map(str,input_list))

df = pd.DataFrame(input_list, columns=['ID', 'name', 'imports', 'Power Group'])

df.to_csv('test_data_new.csv', index=False)

out = df.to_json('test_data_new.json',orient='records')