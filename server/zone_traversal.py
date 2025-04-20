from collections import deque


def bfs(adjacency, start, goal=9):
    """
    Perform a breadth-first search to find a path from start to goal.

    Args:
        adjacency: Dictionary representing the adjacency list of the graph
        start: Starting node
        goal: Goal node (default is 9)

    Returns:
        A list representing the path from start to goal, or None if no path exists
    """
    queue = deque()
    queue.append((start, [start]))
    visited = set()

    while queue:
        current, path = queue.popleft()
        visited.add(current)

        # If goal is reached
        if current == goal:
            return path

        # Add all unvisited neighbors to the queue
        for neighbor in adjacency[current]:
            if neighbor not in visited:
                queue.append((neighbor, path + [neighbor]))

    # If no path is found
    return None
