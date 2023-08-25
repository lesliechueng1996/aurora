import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MenuCreateDto } from './dto/menu-create.dto';
import { HideMenuDto } from './dto/hide-menu.dto';

@Controller('menu')
@ApiTags('菜单')
@ApiBadRequestResponse({ description: '参数不合法' })
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '创建菜单/目录' })
  @ApiCreatedResponse({ description: '创建菜单/目录成功' })
  async createMenu(@Body() body: MenuCreateDto) {
    await this.menuService.saveMenu(body);
  }

  @Post(':id')
  @ApiOperation({ summary: '创建子菜单' })
  @ApiParam({ name: 'id', description: '父级目录ID' })
  @ApiCreatedResponse({ description: '创建子菜单成功' })
  async createSubMenu(
    @Body() body: MenuCreateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.menuService.saveSubMenu(id, body);
  }

  @Get()
  @ApiOperation({ summary: '查询菜单树' })
  @ApiQuery({ name: 'menuName', description: '菜单/目录名称', required: false })
  @ApiQuery({ name: 'index', description: '是否用于首页', required: false })
  @ApiOkResponse({ description: '查询菜单树成功' })
  async searchMenuTree(
    @Query('menuName') menuName?: string,
    @Query('index') index?: string,
  ) {
    return await this.menuService.searchMenus(!!index, menuName);
  }

  @Patch(':id')
  @ApiOperation({ summary: '隐藏/显示菜单' })
  @ApiParam({ name: 'id', description: '菜单/目录 ID' })
  @ApiOkResponse({ description: '成功' })
  async hideMenu(
    @Body() body: HideMenuDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { isHide } = body;
    if (isHide) {
      await this.menuService.hideMenu(id);
    } else {
      await this.menuService.showMenu(id);
    }
  }
}
