import moment from 'moment';



let arrForOurSaveTargets = [];

let goalName = document.querySelector('#goal-name');
let sumRequired = document.querySelector('#sum-required');
let period = document.querySelector('#period');
let initialSum = document.querySelector('#initial-sum');
let percent = document.querySelector('#percent');
let monthlyPayment = document.querySelector('#monthly-payment');
let formSaveBtn = document.querySelector('#form-save-btn');
let formCancelBtn = document.querySelector('#form-cancel-btn');
let activeCardDataID = null;
let savedGoals = document.querySelector('#saved-goals');

let spanErrorTime = document.querySelector('#error-message1');
let spanErrorEmptyInputs = document.querySelector('#error-message2');


// Left form
let form = document.querySelector('#goal-form');

// Goal list 
let targetsList = document.querySelector('#saved-goals');

function calcMonths() {
    let start =  moment().format('MM-YYYY')
    let end = period.value;
    let a = moment(start, "MM-YYYY");
    let b = moment(end, "MM-YYYY");
    let  months = b.diff(a, 'month');

    if (months > 0) {
        console.log(months) 
        spanErrorTime.style.visibility = "hidden"
        return months;
    } else {
        spanErrorTime.style.visibility = "visible"
    }  
}

function isCorrectDate() {
  let start =  moment().format('MM-YYYY')
  let end = period.value;
  let a = moment(start, "MM-YYYY");
  let b = moment(end, "MM-YYYY");
  let  months = b.diff(a, 'month');

  if (months > 0) {
      return true;
  } else {
    return false;
  }  
}

function isEmptyInputs() {
  spanErrorEmptyInputs.style.visibility = "visible"
  if( goalName.value.trim() !== "" && sumRequired.value.trim() !== "" && period.value.trim() !== "" && period.value.length >= 6 && initialSum.value.trim() !== ""&& percent.value.trim() !== "" ) {
  spanErrorEmptyInputs.style.visibility = "hidden"
    calculatedSumOfPaymant()

  } else if ( goalName.value.trim() !== "" || sumRequired.value.trim() !== "" || period.value.trim() !== "" || period.value.length >= 6 || initialSum.value.trim() !== ""|| 
  percent.value.trim() !== "") {
    monthlyPayment.value = "";
    console.log("One of the fields isn't filled")

  } else if(goalName.value.trim() == "" && sumRequired.value.trim() == "" && period.value.trim() == "" && initialSum.value.trim() == "" && percent.value.trim() == "") {
    spanErrorEmptyInputs.style.visibility = "hidden"
    spanErrorTime.style.visibility = "hidden"
  }
}

function validationTime(event) {
  let reg = /((0|1)[1-9]|10)-202[1-9]/
  if(reg.test(event.target.value) && event.target.value.length == 7) {
    let isCorrectDat = isCorrectDate()
    if(isCorrectDat) {
      console.log("Соответствует")
      spanErrorTime.style.visibility = "hidden"
    } else {
      spanErrorTime.style.visibility = "visible"
    }
  } else if(event.target.value == "") {
    spanErrorTime.style.visibility = "hidden"
  } else {
    spanErrorTime.style.visibility = "visible"
  }
}


function calculatedSumOfPaymant() {
  let someMonth = calcMonths()
  let sumRequire = sumRequired.value
  let initialSumm = initialSum.value
  let percen = percent.value
  let koeff = ( 1 + ( percen / 100 / 12 ) )**someMonth

  console.log("Коэффициент koeff", koeff)
  let initiaDeposite = ( sumRequire / koeff ) - initialSumm

  // console.log("Начальный депозит, по формуле", initiaDeposite)
  let monthlyPaymen = initiaDeposite / someMonth
  
  // console.log("Размер ежемесячного платежа", monthlyPaymen)

  monthlyPayment.value = Number(monthlyPaymen).toFixed(2)
};

function expandСollapse (event) {
  if ((event.target.closest('.arrow')) && (event.target.closest('.arrow').dataset.collapsed === 'false')) {

    let cards = event.currentTarget.querySelectorAll('.target-card');
    cards.forEach((card)=> {
      card.querySelector('.arrow').dataset.collapsed = 'false';
      card.querySelector('.target-card-hidden-block').style.display = 'none';
      card.querySelector('.arrow').style.transform = 'rotate(360deg)';
    });

    event.target.closest('.arrow').dataset.collapsed = 'true';
    event.target.closest('.target-card').querySelector('.target-card-hidden-block').style.display = 'block';
    event.target.closest('.arrow').style.transform = 'rotate(180deg)';

  } else if ((event.target.closest('.arrow')) && (event.target.closest('.arrow').dataset.collapsed === 'true')) {

    event.target.closest('.arrow').dataset.collapsed = 'false';
    event.target.closest('.target-card').querySelector('.target-card-hidden-block').style.display = 'none';
    event.target.closest('.arrow').style.transform = 'rotate(360deg)';

  }
};



function removeGoal(dataId2) {
  let newArray = arrForOurSaveTargets.filter((card2) => {
      if (card2.id != dataId2) {
          return card2;     
       }
  })
  arrForOurSaveTargets = newArray;
  renderTargetInRightList(arrForOurSaveTargets);
};

function updateGoal(dataId) {
  activeCardDataID = dataId;
  let targetCard = arrForOurSaveTargets.find((card) => {
    if (card.id == dataId) { 
    return card;
    }
  })

  goalName.value = targetCard.goalName;
  sumRequired.value = targetCard.sumRequired;
  period.value = targetCard.period;
  initialSum.value = targetCard.initialSum;
  percent.value = targetCard.percent;
  monthlyPayment.value = targetCard.monthlyPayment;
}

function saveOurTargetInTargetsArray() {
  if( goalName.value.trim() !== "" && sumRequired.value.trim() !== "" && period.value.trim() !== "" && period.value.length >= 6 && initialSum.value.trim() !== ""&& 
  percent.value.trim() !== "" && monthlyPayment.value.trim()  !== "") {
    let targetObj = {
      id: Date.now(),
      goalName: goalName.value,
      sumRequired: sumRequired.value,
      period: period.value,
      initialSum: initialSum.value,
      percent: percent.value,
      monthlyPayment: monthlyPayment.value,
    }
  if(activeCardDataID !== null) {
      arrForOurSaveTargets = arrForOurSaveTargets.filter((card2) => {
        if (card2.id != activeCardDataID) {
            return card2;     
        }
      })
      activeCardDataID = null;
    }

    arrForOurSaveTargets.push(targetObj)

    let newTargetsArrayWithoutDublicates = removeDuplicates(arrForOurSaveTargets)
    // console.log("Массив без дубликатов newTargetsArrayWithoutDublicates", newTargetsArrayWithoutDublicates)
    form.reset()
    renderTargetInRightList(newTargetsArrayWithoutDublicates)
  }
}


function removeDuplicates(arr) {
  const result = [];
  const duplicatesIndices = [];
  arr.forEach((current, index) => {
      if (duplicatesIndices.includes(index)) return;
      result.push(current);
      for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
          const comparison = arr[comparisonIndex];
          const currentKeys = Object.keys(current);
          const comparisonKeys = Object.keys(comparison);

          if (currentKeys.length !== comparisonKeys.length) continue;
          const currentKeysString = currentKeys.sort().join("").toLowerCase();
          const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
          if (currentKeysString !== comparisonKeysString) continue;
          let valuesEqual = true;
          for (let i = 0; i < currentKeys.length; i++) {
              const key = currentKeys[i];
              if ( current[key] !== comparison[key] ) {
                  valuesEqual = false;
                  break;
              }
          }
          if (valuesEqual) duplicatesIndices.push(comparisonIndex);
      } 
  });  
  // console.log("Нам массив целей БЕЗ дубликатов", result)
  return result;
}


function renderTargetInRightList(newTargetsArrayWithoutDublicates) {
  targetsList.innerHTML = ""
  newTargetsArrayWithoutDublicates.forEach( target => {
    let targetHTML = `
                    <div class="target-card" data-id=${target.id}>
                      <div class="target-card-title-and-arrow">
                        <p class="target-card-title">${target.goalName}</p>
                        <div class="arrow" data-collapsed="false">
                          <svg class="arrow-to-down" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                          width="15px" height="15px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve">
                          <g><g id="expand-more">
                              <polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35 "/>
                            </g></g>
                          </svg>
                        </div>
                      </div>
                      <div class="target-card-hidden-block">
                        <p>Required amount: ${target.sumRequired}</p>
                        <p>Срок: ${target.period}</p>
                        <p class="target-card-initial-sum">Starting amount: ${target.initialSum}</p>
                        <p class="target-card-percent">Interest rate on deposit: ${target.percent} %</p>
                        <p class="target-card-monthly-payment">Monthly payment: ${target.monthlyPayment}</p>
                        <div class="target-card-row-for-buttons">
                          <button type="button" class="changeCardBtn target-card-change-btn cardBtn">Change</button>
                          <button type="button" class="deleteCardBtn target-card-remove-btn cardBtn">Remove</button>
                        </div>
                      </div>
                    </div>`

      targetsList.insertAdjacentHTML("beforeend", targetHTML)
  })

  document.querySelectorAll('.target-card').forEach((card2) => {
    let removeBtn = card2.querySelector('.target-card-remove-btn');
    let dataId2 = card2.dataset.id
    removeBtn.addEventListener("click", () => removeGoal(dataId2))
  })

  document.querySelectorAll('.target-card').forEach((card) => {
    let changeBtn = card.querySelector('.target-card-change-btn')
    let dataId = card.dataset.id
    // console.log(dataId)
    changeBtn.addEventListener("click", () => updateGoal(dataId));
  })
}

function resetForm() {
  form.reset()
  activeCardDataID = null;
}

goalName.addEventListener("input", isEmptyInputs)
sumRequired.addEventListener("input", isEmptyInputs)
period.addEventListener("input", isEmptyInputs)
period.addEventListener("input", validationTime)
initialSum.addEventListener("input", isEmptyInputs)
percent.addEventListener("input", isEmptyInputs)
formSaveBtn.addEventListener("click", saveOurTargetInTargetsArray)
formCancelBtn.addEventListener("click", resetForm)
savedGoals.addEventListener("click", expandСollapse)
