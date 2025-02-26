# Topological Sorting for Evacuation Planning

Topological sorting was implemented in Family list view component
This README explains the implementation of topological sorting for evacuation planning in disaster scenarios. The algorithm prioritizes families for evacuation based on:

1. Dependency relationships (vulnerable families depend on support families)
2. Proximity to disaster location

## Problem Overview

During a disaster evacuation, we need to consider:

- Vulnerable families who need assistance
- Non-vulnerable families who can provide support
- The proximity of each family to the disaster

Rather than using a simple weighted scoring system, we implement a topological sort to ensure **support families are evacuated before the vulnerable families that depend on them**.

## Implementation

### Step 1: Family Classification

First, we classify families as either vulnerable or non-vulnerable:

```javascript
// Determine if a family is vulnerable
const isVulnerableFamily = (family) => {
  return (
    family.family_members.some((m) => m.is_vulnerable) ||
    family.medical_requirements.dependent_on_equipment ||
    family.medical_requirements.immediate_medical_assistance_needed
  );
};

// Classify families
const vulnerableFamilies = [];
const nonVulnerableFamilies = [];

familiesData.forEach((family) => {
  if (isVulnerableFamily(family)) {
    vulnerableFamilies.push(family);
  } else {
    nonVulnerableFamilies.push(family);
  }
});
```

### Step 2: Calculate Disaster Proximity

We calculate how close each family is to the disaster location:

```javascript
const familiesWithProximity = familiesData.map((family) => {
  const familyCoords = family.address.location.coordinates;
  const distance = calculateDistance(familyCoords, disasterLocation);
  const proximityScore = Math.max(0, 100 - (distance / 1000) * 10); // 10 points per km away

  return {
    ...family,
    disasterProximityScore: proximityScore,
    distance,
  };
});
```

### Step 3: Build Dependency Graph

We create a directed graph where each vulnerable family depends on its nearest non-vulnerable family:

```javascript
// Initialize graph structures
const graph = {}; // Adjacency list
const inDegree = {}; // Number of dependencies for each family

// Initialize graph for all families
familiesData.forEach((family) => {
  graph[family._id] = [];
  inDegree[family._id] = 0;
});

// For each vulnerable family, find the nearest non-vulnerable family
vulnerableFamilies.forEach((vulnFamily) => {
  if (nonVulnerableFamilies.length === 0) return;

  let nearestNonVuln = null;
  let minDistance = Infinity;

  nonVulnerableFamilies.forEach((nonVulnFamily) => {
    const distance = calculateDistance(
      vulnFamily.address.location.coordinates,
      nonVulnFamily.address.location.coordinates
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestNonVuln = nonVulnFamily;
    }
  });

  if (nearestNonVuln) {
    // Create dependency: vulnerable family depends on non-vulnerable family
    // So non-vulnerable family must be evacuated first
    graph[nearestNonVuln._id].push(vulnFamily._id);
    inDegree[vulnFamily._id]++;
  }
});
```

### Step 4: Apply Kahn's Algorithm for Topological Sorting

We implement Kahn's algorithm with a priority-based modification:

```javascript
// Kahn's algorithm for topological sorting
const topologicalOrder = [];
const queue = [];

// Start with nodes that have no dependencies (inDegree = 0)
Object.keys(inDegree).forEach((familyId) => {
  if (inDegree[familyId] === 0) {
    queue.push(familyId);
  }
});

// Sort queue by disaster proximity (families closer to disaster get priority)
queue.sort((a, b) => {
  const familyA = familiesWithProximity.find((f) => f._id === a);
  const familyB = familiesWithProximity.find((f) => f._id === b);
  return familyB.disasterProximityScore - familyA.disasterProximityScore;
});

// Process the queue
while (queue.length > 0) {
  // Take the family with highest priority (closest to disaster)
  const current = queue.shift();
  topologicalOrder.push(current);

  // For each dependent family
  graph[current].forEach((dependentFamilyId) => {
    inDegree[dependentFamilyId]--;

    // If all dependencies are satisfied, add to queue
    if (inDegree[dependentFamilyId] === 0) {
      queue.push(dependentFamilyId);
    }
  });

  // Re-sort the queue each time to ensure disaster proximity priority
  queue.sort((a, b) => {
    const familyA = familiesWithProximity.find((f) => f._id === a);
    const familyB = familiesWithProximity.find((f) => f._id === b);
    return familyB.disasterProximityScore - familyA.disasterProximityScore;
  });
}
```

### Step 5: Cycle Detection and Fallback Mechanism

We check for cycles in the dependency graph and provide a fallback:

```javascript
// Check for cycles in the graph
if (topologicalOrder.length !== Object.keys(graph).length) {
  console.error("Graph has cycles! Topological sort not possible.");
  // Fall back to proximity-based sorting if topological sort fails
  return familiesWithProximity.sort(
    (a, b) => b.disasterProximityScore - a.disasterProximityScore
  );
}
```

## Key Advantages

1. **Respect for Dependencies**: Support families are evacuated before the vulnerable families that depend on them
2. **Priority Within Levels**: Among independent families (same dependency level), those closest to the disaster are evacuated first
3. **Cycle Safety**: If dependencies create circular references, the system falls back to proximity-based sorting
4. **Balanced Approach**: Considers both family relationship dependencies and physical proximity to the disaster

## Usage in React Component

The topological sorting function is called in the React component's useEffect:

```javascript
useEffect(() => {
  if (familyData && disasterLoc) {
    if (Array.isArray(familyData)) {
      // Use topological sorting instead of priority-based sorting
      const sorted = buildDependencyGraphAndSort(familyData, disasterLoc);
      setSortedFamilies(sorted);
      setFamilies(familyData);
    } else {
      console.error("Data is not an array:", familyData);
    }
  }
}, [disasterLoc, familyData]);
```

## Visualization in UI

The UI displays the dependency relationships:

```jsx
<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Other elements... */}

  <div>
    <h3 className="font-semibold text-gray-400">Dependency Status</h3>
    <p className="text-blue-500 font-semibold">
      {isVulnerableFamily(family)
        ? `Depends on: ${family.dependsOn || "None"}`
        : `Supporting: ${family.dependencies?.length || 0} families`}
    </p>
  </div>
</div>;

{
  /* Family type indicator */
}
<div
  className={`absolute bottom-4 right-12 ${
    isVulnerableFamily(family) ? "bg-red-600" : "bg-green-600"
  } text-white font-bold rounded-md px-2 py-1 text-sm`}
>
  {isVulnerableFamily(family) ? "Vulnerable" : "Support"}
</div>;
```

## Summary

This topological sorting approach creates an evacuation order that ensures helpers (non-vulnerable families) are evacuated before the vulnerable families that depend on them, while still prioritizing families closest to the disaster within each dependency group.
