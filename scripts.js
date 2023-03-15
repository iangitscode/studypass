
// Create and deserialize rewards array 
let rewards = `Head Pat,1
Head Pat,60
Head Pat,300
One "Good Girl",600
Cuddle Coupon,1800
Swiftplay Break,3600
Bubble Tea Break,7200
Cuddle Coupon,9000
Quality Massage,10800
Cuddle Coupon,12600
Battlegrounds Break,13500
Movie Date,18000
Cuddle Coupon,19800
Unrated Break,20700
Dinner Date,25200
Cuddle Coupon,27000
Swiftplay Break,27900
Fresh Baking4U,32400
Cuddle Coupon,34200
Battlegrounds Break,35100
Movie Date,39600
Cuddle Coupon,41400
Unrated Break,42300
Quality Massage,43200
Personal Serenade,48600
Swiftplay Break,49500
Anime Night,54000
Battlegrounds Break,56700
Unrated Break,63900
Homemade dinner,72000
Quality Massage,75600
Quality Massage,79140
Cuddle Coupon,86400
Breakfast In Bed,90000
Acorn Brunch,108000`;

rewards = rewards.split('\n');
let output = [];
for (let r of rewards) {
  r = r.split(',');
  output.push(r);
}
rewards = output;

const rc = document.getElementsByClassName("rewards-track")[0];
for (let i in rewards) {
  const name = rewards[i][0];
  const value = rewards[i][1];

  const rewardSpan = document.createElement("span");
  const rewardStatus = document.createElement("span");
  const rewardName = document.createElement("span");
  const rewardCost = document.createElement("span");

  rewardSpan.className="reward";
  rewardStatus.className="reward-status";
  rewardName.className="reward-name";
  rewardCost.className="reward-cost";

  rewardName.innerText = name;
  rewardCost.innerText = secondsToPrettyString(parseInt(value));

  rewardSpan.appendChild(rewardStatus);
  rewardSpan.appendChild(rewardName);
  rewardSpan.appendChild(rewardCost);

  rewardName.addEventListener("click", () => {
    setAndSaveRewardAnnotations(i)
  });
  rc.appendChild(rewardSpan);
}

// Initiate variables
let count = Math.max(localStorage.getItem("total_count"), 0);
let is_counting = false;
drawCount();
setAndSaveRewardAnnotations(null);

// Set body colour
document.getElementsByTagName("body")[0].style.backgroundColor=getRandomColor();

// Set up timer
setInterval(()=> {
  if (is_counting) {
    count++;
    drawCount();
    setAndSaveRewardAnnotations(null); 
    localStorage.setItem("total_count", count);
  }
}, 1000);

function toggle() {
  is_counting = !is_counting;
  if (is_counting) {
    document.getElementById("toggle-timer").value = "Stop";
  } else {
    document.getElementById("toggle-timer").value = "Start";
  }
}

function drawCount() {
  document.getElementById("count-box").innerText = secondsToPrettyString(count);
}

function setAndSaveRewardAnnotations(index) {
  let rewardAnnotations = []
  try {
    rewardAnnotations = localStorage.getItem("rewards-track").split(",");
  } catch (e) {
    for (let i = 0; i < rewards.length; i++) {
      rewardAnnotations.push(0);
    }
  }

  const rewardsHTML = document.getElementsByClassName("reward");
  for (let i = 0; i < rewardsHTML.length; i++) {
    const reward = rewardsHTML[i];
    if (index && count > parseInt(rewards[index][1])) {
      rewardAnnotations[index] = 1;
    }

    if (rewardAnnotations[i] == "1") {
      reward.children[0].innerHTML = '';
      reward.children[1].className += " checked";
    } else if (count >= parseInt(rewards[i][1])) {
      reward.children[0].innerHTML = '&#8595;'  
    } 
  }

  localStorage.setItem("rewards-track", rewardAnnotations.join(","));
}

function secondsToPrettyString(seconds) {
  let result = "";
  numDays = Math.floor(seconds/86400);
  if (numDays > 0) {
    result += numDays + "d ";
    seconds = seconds%86400;
  }
  
  numHours = Math.floor(seconds/3600);
  if (numHours > 0) {
    result += numHours + "h ";
    seconds = seconds%3600;
  }
  
  numMins = Math.floor(seconds/60);
  if (numMins > 0) {
    result += numMins + "m ";
    seconds = seconds%60;
  }

  if (seconds > 0 || result == "") {
    result += seconds + "s";
  }
    
  return result.trim();
}

function getRandomColor() {
  let letters = '789ABCDE';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 8)];
  }
  return color;
}

// double time at 8:20pm EST