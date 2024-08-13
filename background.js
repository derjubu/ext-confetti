chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isExtensionOn: true }, () => {
    updateIcon(true)
  })
})

chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.get('isExtensionOn', (data) => {
    const isOn = !data.isExtensionOn // Toggle the state
    chrome.storage.sync.set({ isExtensionOn: isOn }, () => {
      updateIcon(isOn)
      toggleContentScript(isOn) // Send a message to toggle the content script
    })
  })
})

function updateIcon(isOn) {
  const iconPath = isOn ? 'icon_on.png' : 'icon_off.png'
  chrome.action.setIcon({ path: iconPath })
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message)
  }
  console.log(`Extension is now ${isOn ? 'ON' : 'OFF'}`)
}

function toggleContentScript(isOn) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: toggleScript,
        args: [isOn],
      })
    }
  })
}

function toggleScript(isOn) {
  chrome.storage.sync.set({ isExtensionOn: isOn })
}
