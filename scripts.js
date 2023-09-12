
// Create and deserialize rewards array 
let rewards = `Head Pat,1,Good job Eva!
Head Pat,60,Good job Eva!
Head Pat,300,Good job Eva!
One "Good Girl",600,Yes you are :)
Cuddle Coupon,1800,15 min usable anytime
Swiftplay Break,3600,For a quicc break while working
Bubble Tea Break,7200,Whenever you need a quick pick me up
Cuddle Coupon,9000,15 min usable anytime
Quality Massage,10800,Massaged until satisfied
Cuddle Coupon,12600,15 min usable anytime
Battlegrounds Break,13500,I promise not to punch you too hard
Movie Date,18000,Movie of your choice - complete with popcorn and snacks
Cuddle Coupon,19800,15 min usable anytime
Unrated Break,20700,For a longer break while working :)
Dinner Date,25200,Includes main course + dessert + drinks
Cuddle Coupon,27000,15 min usable anytime
Swiftplay Break,27900,For a quicc break while working
Fresh Baking4U,32400,I will make baked goods of your choice
Cuddle Coupon,34200,15 min usable anytime
Battlegrounds Break,35100,I promise not to punch you too hard
Movie Date,39600,Movie of your choice - complete with popcorn and snacks
Cuddle Coupon,41400,15 min usable anytime
Unrated Break,42300,For a longer break while working :)
Quality Massage,43200,Massaged until satisfied
Personal Serenade,48600,Song of your choice - filming not allowed
Swiftplay Break,49500,For a quicc break while working
Anime Night,54000,Wotakoi with your Wotaboi?
Battlegrounds Break,56700,I promise not to punch you too hard
Unrated Break,63900,For a longer break while working :)
Homemade dinner,72000,3 courses - dishes included
Quality Massage,75600,Massaged until satisfied
Quality Massage,79140,Massaged until satisfied
Cuddle Coupon,86400,15 min usable anytime
Breakfast In Bed,90000,Pancakes + Hash browns + Fruit
Acorn Brunch,108000,Whatever's in season
Add New Rewards,108001,You've earned it :)`;

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
  const tooltip = rewards[i][2];

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
  rewardName.title = tooltip;

  rc.appendChild(rewardSpan);
}

// Initiate variables
let count = Math.max(localStorage.getItem("total_count"), 25200+5400); // offset by 7h 90min
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