from collections import defaultdict

# Door to node connections
doors = {
    0: [0, 8],
    1: [1, 8],
    2: [2, 8],
    3: [3, 8],
    4: [6, 8],
    5: [7, 6],
    6: [6, 5],
    7: [5, 7],
    8: [4, 7],
    9: [5, 8]
}

# Initialize adjacency list
adjacency_list = defaultdict(list)

# Loop through each door to connect the two nodes
for door, (a, b) in doors.items():
    adjacency_list[a].append(b)
    adjacency_list[b].append(a)  # Assuming undirected graph

# Print adjacency list
for node in sorted(adjacency_list):
    print(f"{node}: {adjacency_list[node]}")
