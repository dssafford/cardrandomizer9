import { AppMaterial.Module.TsModule } from './app-material.module.ts.module';

describe('AppMaterial.Module.TsModule', () => {
  let appMaterialModuleTsModule: AppMaterial.Module.TsModule;

  beforeEach(() => {
    appMaterialModuleTsModule = new AppMaterial.Module.TsModule();
  });

  it('should create an instance', () => {
    expect(appMaterialModuleTsModule).toBeTruthy();
  });
});
