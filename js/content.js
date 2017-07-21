var configEventGuestList = {
  classNames: {
    userName: 'user-name',
    jobTitle: 'title h5',
    companyName: 'company'
  }
};

var configSearch = {
  classNames: {
    userName: 'name-page-link',
    jobTitle: 'occupation-title',
    companyName: 'company-name'
  }
};

main();

function main() {
  if (isEventGuestList()) {
    var eventTitleElement = document.getElementsByClassName('event-title');
    var eventTitle = removeSpecialCharactersFromFileName(eventTitleElement.item(0).textContent);

    exportMembers(eventTitle + '.csv', document.getElementsByClassName('guestlist-row'), configEventGuestList);
  } else if (isSearch()) {
    exportMembers('search-results.csv', document.getElementsByClassName('member search-result'), configSearch);
  }
}

function isEventGuestList() {
  return document.getElementsByClassName('guestlist-row').length > 0;
}

function isSearch() {
  return document.getElementsByClassName('member search-result').length > 0;
}

function exportMembers(fileName, memberElements, config) {
  var BOM = '\uFEFF';
  var membersAsCSV = BOM + 'Name;Job;Company\n';

  membersAsCSV += convertMemberElementsToCSVString(memberElements, config);

  downloadFileFromText(fileName, membersAsCSV);
}

function convertMemberElementsToCSVString(memberElements, config) {
  var guestListAsCSV = '';

  for (var index = 0; index < memberElements.length; index++) {
    var memberElement = memberElements.item(index);
    var csvRow = convertMemberElementToCSVStringRow(memberElement, config);

    guestListAsCSV += csvRow;
  }

  return guestListAsCSV;
}

function convertMemberElementToCSVStringRow(memberElement, config) {
  var userNameElement = getUserNameElement(memberElement, config.classNames.userName);
  var jobTitleElement = memberElement.getElementsByClassName(config.classNames.jobTitle).item(0);
  var companyElement = memberElement.getElementsByClassName(config.classNames.companyName).item(0);

  var userName = removeSpecialCharactersFromAttribute(userNameElement.textContent);
  var jobTitle = removeSpecialCharactersFromAttribute(jobTitleElement.textContent);
  var company = removeSpecialCharactersFromAttribute(companyElement.textContent);

  return userName + ";" + jobTitle + ";" + company + "\n";
}

function getUserNameElement(memberElement, className) {
  var userNameElement = null;
  var possibleUserNameElements = memberElement.getElementsByClassName(className);

  for (var i = 0; i < possibleUserNameElements.length; i++) {
    userNameElement = possibleUserNameElements.item(i);
    if (userNameElement.textContent) {
      break;
    }
  }

  return userNameElement;
}

function removeSpecialCharactersFromAttribute(stringWithSpecialChars) {
  return stringWithSpecialChars
    .replace(new RegExp('\n', 'g'), ' ')
    .replace(new RegExp(/^ +/gm, 'g'), '')
    .replace(new RegExp(/ +$/gm, 'g'), '')
}

function removeSpecialCharactersFromFileName(stringWithSpecialChars) {
  return stringWithSpecialChars
    .replace(new RegExp('\n', 'g'), '')
    .replace(new RegExp('\\.', 'g'), '_')
    .replace(new RegExp(' ', 'g'), '_')
    .replace(new RegExp('!', 'g'), '_')
    .replace(new RegExp('\\?', 'g'), '_')
    .replace(new RegExp('=', 'g'), '_');
}

function downloadFileFromText(filename, content) {
  var anchorElement = document.createElement('a');
  var blob = new Blob([content], {type : "text/csv;charset=UTF-8"});

  anchorElement.href = window.URL.createObjectURL(blob);
  anchorElement.download = filename;
  anchorElement.style.display = 'none';

  document.body.appendChild(anchorElement);

  anchorElement.click();

  delete anchorElement;
}