document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('calculate-button')) {
    document.getElementById('calculate-button').addEventListener('click', calculate);
    loadSettings();
    populateSettingsDropdown();
  }
  if (document.getElementById('apply-settings-button')) {
    document.getElementById('apply-settings-button').addEventListener('click', applySettings);
  }
  if (document.getElementById('settings-button')) {
    document.getElementById('settings-button').addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
  }
  if (document.getElementById('back-button')) {
    document.getElementById('back-button').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
  if (document.getElementById('apply-selected-setting')) {
    document.getElementById('apply-selected-setting').addEventListener('click', applySelectedSetting);
  }
});

function applySettings() {
  const settingName = document.getElementById('setting-name').value;
  const defaultBasicCharge = parseFloat(document.getElementById('default-basic-charge').value);
  const defaultUnitPrice = parseFloat(document.getElementById('default-unit-price').value);
  const defaultAdjustmentPrice = parseFloat(document.getElementById('default-adjustment-price').value);

  if (isNaN(defaultBasicCharge) || isNaN(defaultUnitPrice) || isNaN(defaultAdjustmentPrice)) {
    alert("設定のすべての値に数値を入力してください。");
    return;
  }

  const settings = {
    name: settingName,
    basicCharge: defaultBasicCharge,
    unitPrice: defaultUnitPrice,
    adjustmentPrice: defaultAdjustmentPrice
  };

  localStorage.setItem(`setting_${settingName}`, JSON.stringify(settings));
  localStorage.setItem('currentSettingName', settingName);

  alert(`設定 "${settingName}" が適用されました。`);
  window.location.href = 'index.html';
}

function applySelectedSetting() {
  const selectedSettingName = document.getElementById('settings-dropdown').value;
  const settings = JSON.parse(localStorage.getItem(`setting_${selectedSettingName}`));

  if (settings) {
    document.getElementById('basic-charge').value = settings.basicCharge;
    document.getElementById('unit-price').value = settings.unitPrice;
    document.getElementById('adjustment-price').value = settings.adjustmentPrice;
    document.getElementById('current-setting-name').innerText = settings.name;
    localStorage.setItem('currentSettingName', settings.name);
  }
}

function populateSettingsDropdown() {
  const dropdown = document.getElementById('settings-dropdown');
  dropdown.innerHTML = ''; // Clear existing options

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('setting_')) {
      const settings = JSON.parse(localStorage.getItem(key));
      const option = document.createElement('option');
      option.value = settings.name;
      option.text = settings.name;
      dropdown.appendChild(option);
    }
  }
}

function calculate() {
  const startDate = new Date(document.getElementById('start-date').value);
  const endDate = new Date(document.getElementById('end-date').value);
  const previousReading = parseFloat(document.getElementById('previous-reading').value);
  const currentReading = parseFloat(document.getElementById('current-reading').value);
  const basicCharge = parseFloat(document.getElementById('basic-charge').value);
  const unitPrice = parseFloat(document.getElementById('unit-price').value);
  const adjustmentPrice = parseFloat(document.getElementById('adjustment-price').value);

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  console.log("Previous Reading:", previousReading);
  console.log("Current Reading:", currentReading);
  console.log("Basic Charge:", basicCharge);
  console.log("Unit Price:", unitPrice);
  console.log("Adjustment Price:", adjustmentPrice);

  if (isNaN(previousReading) || isNaN(currentReading) || isNaN(basicCharge) || isNaN(unitPrice) || isNaN(adjustmentPrice)) {
    alert("すべての入力フィールドに数値を入力してください。");
    return;
  }

  if (startDate > endDate) {
    alert("使用開始日は使用終了日より前でなければなりません。");
    return;
  }

  const usageAmount = currentReading - previousReading;
  const unitCharge = unitPrice * usageAmount;
  const adjustmentCharge = adjustmentPrice * usageAmount;

  let totalBasicCharge = 0;
  if (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()) {
    totalBasicCharge = basicCharge;
  }

  const totalCharge = 1.1 * (totalBasicCharge + unitCharge + adjustmentCharge);

  console.log("Usage Amount:", usageAmount);
  console.log("Unit Charge:", unitCharge);
  console.log("Adjustment Charge:", adjustmentCharge);
  console.log("Total Charge:", totalCharge);

  document.getElementById('usage-amount').innerText = usageAmount.toFixed(2);
  document.getElementById('unit-charge').innerText = unitCharge.toFixed(2);
  document.getElementById('adjustment-charge').innerText = adjustmentCharge.toFixed(2);
  document.getElementById('total-charge').innerText = totalCharge.toFixed(2);
}

function loadSettings() {
  const currentSettingName = localStorage.getItem('currentSettingName');
  if (currentSettingName) {
    document.getElementById('current-setting-name').innerText = currentSettingName;
    const settings = JSON.parse(localStorage.getItem(`setting_${currentSettingName}`));
    if (settings) {
      document.getElementById('basic-charge').value = settings.basicCharge;
      document.getElementById('unit-price').value = settings.unitPrice;
      document.getElementById('adjustment-price').value = settings.adjustmentPrice;
    }
  }
}
