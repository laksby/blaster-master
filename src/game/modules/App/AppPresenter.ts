import { BasePresenter } from '../../core';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppPresenter extends BasePresenter<IAppView> implements IAppPresenter {}
