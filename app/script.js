const groups = {};

function addMember() {
  const memberName = document.getElementById('member-name').value.trim();
  const groupName = document.getElementById('group-name').value.trim();

  if (!memberName || !groupName) {
    alert('Please enter both member and group names.');
    return;
  }

  if (!groups[groupName]) {
    groups[groupName] = [];
  }

  groups[groupName].push(memberName);
  document.getElementById('member-name').value = '';

  displayGroups();
}

function displayGroups() {
  const groupsList = document.getElementById('groups-list');
  groupsList.innerHTML = '';

  for (const [groupName, members] of Object.entries(groups)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${groupName}: ${members.join(', ')}`;
    groupsList.appendChild(listItem);
  }
}

function drawLots() {
  const results = document.getElementById('results');
  results.innerHTML = '';

  const allGroups = Object.entries(groups);
  if (allGroups.length < 2) {
    results.textContent = 'Please add at least two groups with members.';
    return;
  }

  // Flatten all members and keep track of their group
  const allMembers = [];
  for (const [groupName, members] of allGroups) {
    members.forEach(member => {
      allMembers.push({ name: member, group: groupName });
    });
  }

  const pairs = [];
  const availableMembers = [...allMembers];

  while (availableMembers.length > 1) {
    const member1Index = Math.floor(Math.random() * availableMembers.length);
    const member1 = availableMembers.splice(member1Index, 1)[0];

    // Find a member from a different group
    const eligibleMembers = availableMembers.filter(
      member => member.group !== member1.group
    );

    if (eligibleMembers.length === 0) {
      results.textContent =
        'Not enough eligible members to form valid pairs. Try adding more members.';
      return;
    }

    const member2Index = Math.floor(Math.random() * eligibleMembers.length);
    const member2 = eligibleMembers.splice(member2Index, 1)[0];

    // Remove member2 from the available members list
    availableMembers.splice(
      availableMembers.findIndex(m => m.name === member2.name),
      1
    );

    // Form a pair
    pairs.push(`${member1.name} & ${member2.name}`);
  }

  if (availableMembers.length === 1) {
    results.textContent =
      'Uneven number of members. One person will not be paired.';
  }

  results.innerHTML = pairs.map(pair => `<p>${pair}</p>`).join('');
}