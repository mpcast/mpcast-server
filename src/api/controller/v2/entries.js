const Base = require('./_rest')

module.exports = class extends Base {
  // constructor(ctx) {
  //   super(ctx)
    // this.dao = this.model('entries', 'common')
  // }
  async indexAction () {
    // 获取全部版块
    const sections = await this.model('sections').select()
    let sectionIds = []
    let singleSectionIds = []
    let sectionByType = []
    let sources = []


    sections.forEach((section, index) => {
      // console.log(section)
      sectionIds.push(section.id)

      if (section.type === 'single') {
        singleSectionIds.push(section.id)
      } else {
        // sectionByType[section.type] = think.extend()
        // console.log(JSON.stringify(section))
        sectionByType.push([section.type, section])
        // sectionByType.push(section)
      }
    })

    sources = [{
      key: '*',
      label: 'All entries',
      defaultSort: ['postDate', 'desc']
    }]

    if (!think.isEmpty(singleSectionIds)) {
      sources.push({
        key: 'singles',
        label: 'Singles',
        criteria: {
          sectionId: singleSectionIds,
          editable: false
        },
        defaultSort: ['title', 'asc']
      })
    }
    return this.success(sources)
  }
  async editAction () {
  }

  async previewAction() {
    const versionId = this.get('versionId')
    if (versionId) {
      let entry = await this.model('entryversions').getVersionById(versionId)
      if (!entry) {
        return this.fail('Entry version not found')
      }
      return this.success(entry)
    }
  }
}
