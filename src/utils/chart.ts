import dayjs, { Dayjs } from 'dayjs'

const RECENT_7_DAYS: [Dayjs, Dayjs] = [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')]
export const ONE_WEEK_LIST = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export const getRandomInt = (num = 100): number => {
  const resultNum = Number((Math.random() * num).toFixed(0))
  return resultNum <= 1 ? 1 : resultNum
}

export const characterTypeCheck = (pwd: string): number => {
  const regs = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^\u4e00-\u9fa5a-z0-9A-Z]/]

  return regs.reduce((sum, reg) => {
    let ret = sum
    if (reg.test(pwd)) {
      ret += 1
    }

    return ret
  }, 0)
}

const pool = 'abcdefghijklmnopqrstuvwxyz123456789'
export const randomStr = (len = 6) => {
  let str = ''
  while (len-- > 0) {
    str += pool[Math.floor(Math.random() * 29)]
  }
  return str
}

type ChartValue = number | string

export function getTimeArray(dateTime: string[] = [], divideNum = 7, format = 'MM-DD'): string[] {
  const timeArray = []
  if (dateTime.length === 0) {
    dateTime = [ dayjs().subtract(divideNum, 'day').format(format), dayjs().subtract(1, 'day').format(format) ]
  }
  for (let i = divideNum; i > 0 ; --i) {
    const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum
    const timeNode: number = new Date(dateTime[0]).getTime() + dateAbsTime * i
    timeArray.push(dayjs(timeNode).format(format))
  }

  return timeArray
}

export const getChartDataSet = (dateTime: Array<string> = [], divideNum = 10): ChartValue[][] => {
  const timeArray = getTimeArray(dateTime, divideNum)
  const inArray = []
  const outArray = []
  for (let index = 0; index < divideNum; index++) {
    inArray.push(getRandomInt().toString())
    outArray.push(getRandomInt().toString())
  }

  return [timeArray, inArray, outArray]
}

/**
 * 秒转时/分/秒
 * @return {string}
 */
export const secondsToTimeFormat = (time: number) => {
  const hours = parseInt((time / 60 / 60).toString(), 10)
  const minutes = parseInt((time / 60 % 60).toString(), 10)
  const seconds = parseInt((time % 60).toString(), 10)
  return `${!!hours ? hours + '时' : ''}${!!minutes ? minutes + '分' : ''}${!!seconds ? seconds + '秒' : ''}`
}
