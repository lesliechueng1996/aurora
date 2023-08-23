import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MenuCreateDto } from './dto/menu-create.dto';

@Controller('menu')
@ApiTags('菜单')
@ApiBadRequestResponse({ description: '参数不合法' })
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '创建菜单/目录' })
  @ApiOkResponse({ description: '创建菜单/目录成功' })
  async createMenu(@Body() body: MenuCreateDto) {
    await this.menuService.saveMenu(body);
  }

  @Post(':id')
  @ApiOperation({ summary: '创建子菜单' })
  @ApiParam({ name: 'id', description: '父级目录ID' })
  @ApiOkResponse({ description: '创建子菜单成功' })
  async createSubMenu(
    @Body() body: MenuCreateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.menuService.saveSubMenu(id, body);
  }

  @Get()
  @ApiOperation({ summary: '查询菜单树' })
  @ApiQuery({ name: 'menuName', description: '菜单/目录名称', required: false })
  @ApiOkResponse({ description: '查询菜单树成功' })
  async searchMenuTree(@Query('menuName') menuName?: string) {
    return await this.searchMenuTree(menuName);
  }
}
