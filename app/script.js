// Array that stores all members: { name, group }
let members = [];

/**
 * Add a member to the list
 */
function addMember() {
  const memberNameInput = document.getElementById("member-name");
  const groupNameInput = document.getElementById("group-name");

  const name = memberNameInput.value.trim();
  const group = groupNameInput.value.trim();

  // Basic checks
  if (!name) {
    alert("Please enter a name.");
    return;
  }
  if (!group) {
    alert("Please enter a group name.");
    return;
  }

  // Add the member
  members.push({ name, group });

  // Clear only the "Name" field; keep the group to ease multiple additions
  memberNameInput.value = "";

  // Update the displayed list
  updateGroupsList();
}

/**
 * Update the displayed list in UL #groups-list
 */
function updateGroupsList() {
  const groupsList = document.getElementById("groups-list");
  groupsList.innerHTML = "";

  // 1) Create an object that will store members by group
  const groupedByGroup = {};
  members.forEach((member) => {
    // If this group doesn't exist yet, initialize it
    if (!groupedByGroup[member.group]) {
      groupedByGroup[member.group] = [];
    }
    // Add the member's name to the array corresponding to its group
    groupedByGroup[member.group].push(member.name);
  });

  // 2) Traverse each group to create a sub-list
  for (const groupName in groupedByGroup) {
    // Create the main <li> element for the group
    const liGroup = document.createElement("li");
    liGroup.style.listStyle = "none"; // Optional: removes the default bullet for the group

    // Create a title for the group
    const groupTitle = document.createElement("strong");
    groupTitle.textContent = `${groupName}`;
    liGroup.appendChild(groupTitle);

    // 3) Create a nested <ul> for the member names
    const subUl = document.createElement("ul");
    groupedByGroup[groupName].forEach((memberName) => {
      const subLi = document.createElement("li");
      subLi.textContent = memberName;
      subUl.appendChild(subLi);
    });
    liGroup.appendChild(subUl);

    // 4) Append it all to the main list
    groupsList.appendChild(liGroup);
  }
}


/**
 * Start the draw according to the constraints
 */
function drawLots() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (members.length < 2) {
    alert("At least 2 people are required for the draw!");
    return;
  }

  // Try to generate a valid set of assignments
  const assignments = generateAssignments(members);

  if (!assignments) {
    resultsDiv.textContent = "No valid draw could be found.";
    return;
  }

  // Display the result
  const ul = document.createElement("ul");
  assignments.forEach(({ giver, receiver }) => {
    const li = document.createElement("li");
    li.textContent = `${giver.name} → ${receiver.name}`;
    ul.appendChild(li);
  });
  resultsDiv.appendChild(ul);
}

/**
 * Generate a list of assignments (giver -> receiver) that respects the constraints:
 *  1) No drawing within the same group
 *  2) No person can be drawn twice
 *  3) Prohibit reciprocal pairs (no X->Y if Y->X exists)
 */
function generateAssignments(members) {
  // Make a copy so the original isn't altered
  const shuffled = [...members];

  // Shuffle the array randomly (Fisher-Yates)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // usedIndices indicates which indices are already taken as receiver
  const usedIndices = new Set();

  // Backtracking to assign a receiver to each giver
  const result = backtrack(0, []);
  return result;

  /**
   * backtrack(index, currentAssignments)
   *  - index: position of the giver in the shuffled array
   *  - currentAssignments: array of objects { giver, receiver } already assigned
   */
  function backtrack(index, currentAssignments) {
    // If all givers have a receiver, we have a complete draw
    if (index === shuffled.length) {
      return currentAssignments;
    }

    const giver = shuffled[index];

    // Find all possible receiver candidates
    const candidates = [];
    for (let i = 0; i < shuffled.length; i++) {
      const receiver = shuffled[i];
      // Conditions:
      // 1) cannot give to oneself
      // 2) cannot give to someone in the same group
      // 3) the receiver index must not already be used
      if (
        i !== index &&
        receiver.group !== giver.group &&
        !usedIndices.has(i)
      ) {
        candidates.push(i);
      }
    }

    // Shuffle candidates for variation (optional)
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    // Try each candidate
    for (const candidateIndex of candidates) {
      const receiver = shuffled[candidateIndex];

      // Additional check: no reciprocity (avoid A->B if B->A already exists)
      // Check if this receiver has already given to the giver
      const isReciprocal = currentAssignments.some(
        (assignment) =>
          assignment.giver === receiver && assignment.receiver === giver
      );
      if (isReciprocal) {
        // Skip this option
        continue;
      }

      // Mark this receiver as already taken
      usedIndices.add(candidateIndex);

      // Build a new set of assignments
      const newAssignments = [...currentAssignments, { giver, receiver }];

      // Recursive call
      const attempt = backtrack(index + 1, newAssignments);
      if (attempt) {
        // A solution is found
        return attempt;
      }

      // Otherwise, revert
      usedIndices.delete(candidateIndex);
    }

    // If no candidate works, return null for backtracking
    return null;
  }
}
