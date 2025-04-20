from collections import defaultdict


# 10 nodes
# 0-7 inclusive is stores
# 8-9 inclusive is corridors
# 10 is the outside

# Adjacency list, connecting nodes to other nodes
doors = {
    0: [8],
    1: [8],
    2: [8],
    3: [8],
    4: [8, 6, 7],
    5: [7],
    6: [8, 7],
    7: [9],
    8: [9],
    9: [],
}


def calculate_adjacency_list(doors):
    adjacency_list = defaultdict(list)
    for door, connections in doors.items():
        for connection in connections:
            adjacency_list[door].append(connection)
            adjacency_list[connection].append(door)
    return adjacency_list


# The function calculate_adjacency_list should convert the doors dictionary
# to an undirected graph where if A connects to B, then B connects to A.
# Let's check the output:
adjacency_list = calculate_adjacency_list(doors)
print("Node 8 connections:", adjacency_list[8])
print("Full adjacency list:", dict(adjacency_list))

# The reason 8 should have connections to 0,1,2,3 is because in the doors dictionary,
# nodes 0,1,2,3 all have 8 in their connections list, and the calculate_adjacency_list
# function adds bidirectional connections.
