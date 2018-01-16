/* eslint-disable func-style */
const fs = require('fs')

const path = think.ROOT_PATH + '/keywords'

const map = {}

const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(path, {encoding: 'UTF-8'})
});

lineReader.on('line', function (line) {
  if(!line) return
  addWord(line)
});

function addWord(word) {

  let parent = map

  for (let i = 0; i < word.length; i++) {
    if (!parent[word[i]]) parent[word[i]] = {}
    parent = parent[word[i]]
  }
  parent.isEnd = true
}

function filter(s, cb) {
  let parent = map

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '*') {
      continue
    }

    let found = false
    let skip = 0
    let sWord = ''

    for (let j = i; j < s.length; j++) {

      if (!parent[s[j]]) {
        // console.log('skip ', s[j])
        found = false
        skip = j - i
        parent = map
        break;
      }

      sWord += s[j]
      if (parent[s[j]].isEnd) {
        found = true
        skip = j - i
        break
      }
      parent = parent[s[j]]
    }

    if (skip > 1) {
      i += skip - 1
    }

    if (!found) {
      continue
    }

    let stars = '*'
    for (let k = 0; k < skip; k++) {
      stars += '*'
    }

    const reg = new RegExp(sWord, 'g')
    s = s.replace(reg, stars)

  }

  if(typeof cb === 'function') {
    cb(null, s)
  }

  return s
}

module.exports = {
  filter: filter
}
