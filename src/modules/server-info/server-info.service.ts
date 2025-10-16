import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as nodeDiskInfo from 'node-disk-info';
import { bytesToGB } from './utils';

interface DiskType {
  _filesystem: string;
  _blocks: number;
  _used: number;
  _available: number;
  _capacity: string;
  _mounted: string;
}
@Injectable()
export class ServerInfoService {
  async getServerInfo() {
    // 获取cpu信息
    const cpuInfo = this.getCpuInfo();
    // 获取内存信息
    const memoInfo = this.getMemoInfo();
    // 获取磁盘信息
    const diskInfo = await this.getDiskInfo();
    // 获取其他信息
    const sysInfo = this.getSysInfo();
    return {
      cpu: cpuInfo,
      memo: memoInfo,
      disk: diskInfo,
      other: sysInfo,
    };
  }

  // 获取cpu信息
  getCpuInfo() {
    const cpus = os.cpus();
    const cpuInfo = cpus.reduce(
      (info, cpu) => {
        info.cpuNum += 1;
        info.user += cpu.times.user;
        info.sys += cpu.times.sys;
        info.idle += cpu.times.idle;
        info.total += cpu.times.user + cpu.times.idle + cpu.times.sys;
        return info;
      },
      { cpuNum: 0, user: 0, sys: 0, idle: 0, total: 0 },
    );

    const cpu = {
      cpuNum: cpuInfo.cpuNum, // 核数
      sys: ((cpuInfo.sys / cpuInfo.total) * 100).toFixed(2), // 系统使用率
      used: ((cpuInfo.user / cpuInfo.total) * 100).toFixed(2), // 用户使用率
      free: ((cpuInfo.idle / cpuInfo.total) * 100).toFixed(2), // 空闲率
    };

    return cpu;
  }

  // 获取内存信息
  getMemoInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // 内存使用率
    const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2);

    const memoInfo = {
      total: bytesToGB(totalMemory), // 总内存
      used: bytesToGB(usedMemory), // 已使用内存
      free: bytesToGB(freeMemory), // 未使用内存
      usage: memoryUsagePercentage, // 内存使用率
    };
    return memoInfo;
  }

  // 获取磁盘信息
  async getDiskInfo() {
    const disks = await nodeDiskInfo.getDiskInfo();
    const diskInfos: {
      dirName: string;
      typeName: string;
      total: string;
      used: string;
      free: string;
      usage: string;
    }[] = [];

    disks.forEach((disk: any) => {
      const info = {
        dirName: disk._mounted,
        typeName: disk._filesystem,
        total: bytesToGB(disk._blocks) + 'GB',
        used: bytesToGB(disk._used) + 'GB',
        free: bytesToGB(disk._available) + 'GB',
        usage: ((disk._used / disk._blocks || 0) * 100).toFixed(2),
      };
      diskInfos.push(info);
    });

    return diskInfos;
  }

  getSysInfo() {
    return {
      computerName: os.hostname(),
      computerIp: this.getServerIp(),
      osName: os.platform(),
      osArch: os.arch(),
    };
  }

  getServerIp() {
    const nets = os.networkInterfaces(); // 拿到所有网卡信息
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]!) {
        // !net.internal 用于过滤非回环地址
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }
}
