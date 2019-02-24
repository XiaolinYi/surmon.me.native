/**
 * Bussniss constants.
 * @file 业务数据表常量接口
 * @module constants/state
 * @author Surmon <https://github.com/surmon-china>
 */

// 转载状态
export enum EOriginState {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2, // 混合
}

// 排序状态
export enum ESortType {
  Asc = 1, // 升序
  Desc = -1, // 降序
  Hot = 2, // 最热
}
