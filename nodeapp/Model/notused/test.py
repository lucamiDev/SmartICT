import sys

data_to_pass_back = "Send this to the process."

input = sys.argv[1]

output = data_to_pass_back
print(input, output)

sys.stdout.flush()
