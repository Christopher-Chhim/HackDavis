from collections import deque

# Define the nodes and their properties
nodes = {
    "A": {"status": "open", "zone_type": "safe"},
    "B": {"status": "open", "zone_type": "cautious"},
    "C": {"status": "open", "zone_type": "dangerous"},
    "D": {"status": "closed", "zone_type": "safe"},
}

# Define the adjacency list for the graph (dummy nodes)
adjacency = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"]
}

def bfs(start, goal):
    queue = deque()
    queue.append((start, [start]))
    visited = set()

    while queue:
        current, path = queue.popleft()
        visited.add(current)

        # If goal is reached
        if current == goal:
            return path
        
        # Check if any open, non-cautious, non-closed neighbors exist
        open_safe_neighbors = [
            n for n in adjacency[current]
            if nodes[n]["status"] == "open" and nodes[n]["zone_type"] == "safe" and n not in visited
        ]
        open_neighbors = [
            n for n in adjacency[current]
            if nodes[n]["status"] == "open" and n not in visited
        ]

        # Traverse safe zones first
        for neighbor in open_safe_neighbors:
            queue.append((neighbor, path + [neighbor]))

        # If no safe zones, check for cautious zones (if no other open nodes)
        if not open_safe_neighbors:
            open_cautious_neighbors = [
                n for n in adjacency[current]
                if nodes[n]["status"] == "open" and nodes[n]
                ["zone_type"] == "cautious" and n not in visited
            ]

            # Only traverse cautious if all other open nodes are closed or dangerous
            if open_cautious_neighbors and all(
                nodes[n]["zone_type"] != "safe"
                for n in adjacency[current]
                if nodes[n]["status"] == "open" and n not in visited):
                for neighbor in open_cautious_neighbors:
                    queue.append((neighbor, path + [neighbor]))
            
            return None