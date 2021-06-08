//
//  YJViewController.m
//  YJBaseModule
//
//  Created by lyj on 07/20/2019.
//  Copyright (c) 2019 lyj. All rights reserved.
//

#import "YJViewController.h"
#import "PtestViewController.h"
#import <YJBaseModule/YJBWebView.h>
#import <Masonry/Masonry.h>
#import <LGAlertHUD/LGAlertHUD.h>
#import "ViewController4.h"
@interface YJViewController ()<WKNavigationDelegate>
@property (strong, nonatomic) YJBWebView *webView;
@property (strong, nonatomic) YJBView *bView;
@end

@implementation YJViewController

- (void)viewDidLoad{
    [super viewDidLoad];
	
    self.title = @"hao de ";
   
    
//    [self.view addSubview:self.bView];
//    [self.bView mas_makeConstraints:^(MASConstraintMaker *make) {
//        make.edges.equalTo(self.view);
//    }];
//    [self.bView yj_setNoDataViewShow:YES isSearch:NO];
//    [self.view addSubview:self.webView];
//    [self.webView mas_makeConstraints:^(MASConstraintMaker *make) {
//        make.edges.equalTo(self.view);
//    }];
//    [LGAlert showIndeterminate];
//    [self.webView yj_loadRequestWithUrlString:@"http://www.chinalancoo.com"];
}
// 页面加载失败时调用
- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(null_unspecified WKNavigation *)navigation withError:(nonnull NSError *)error{
    [LGAlert showErrorWithStatus:@"加载失败"];
}
// 跳转失败时调用
- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error{
    [LGAlert showErrorWithStatus:@"加载失败"];
}
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler{
    decisionHandler(WKNavigationActionPolicyAllow);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
    [LGAlert hide];
    [self.webView showNavigationBarAtDidFinishNavigation];
}
- (IBAction)push:(id)sender {
    
    ViewController4 *vc = [[ViewController4 alloc] init];
    [self.navigationController pushViewController:vc animated:YES];
}
- (IBAction)cancel:(id)sender {
    [self yj_setLoadingViewShow:NO];
}

- (IBAction)point:(id)sender {
    [self yj_setLoadingViewShow:YES];
}
- (IBAction)pointBg:(id)sender {
    [self yj_setLoadingViewShow:YES backgroundColor:[UIColor colorWithWhite:0.2 alpha:0.4] tintColor:[UIColor whiteColor]];
}
- (IBAction)flower:(id)sender {
    [self yj_setLoadingFlowerTitleViewShow:YES];
}
- (IBAction)gif:(id)sender {
    [self yj_setLoadingGifViewShow:YES];
}
- (IBAction)empty:(id)sender {
    [self yj_setNoDataViewShow:YES isSearch:YES];
}

- (IBAction)loadError:(id)sender {
    [self yj_setLoadErrorViewShow:YES];
}



- (YJBWebView *)webView{
    if (!_webView) {
        WKUserScript *wkUScript = [[WKUserScript alloc] initWithSource:[YJBWebView yj_autoFitTextSizeJSString] injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
        WKUserScript *wkImgScript = [[WKUserScript alloc] initWithSource:[YJBWebView yj_autoFitImgSizeJSString] injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
        WKUserContentController *wkUController = [[WKUserContentController alloc] init];
        [wkUController addUserScript:wkUScript];
        [wkUController addUserScript:wkImgScript];
        WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
        config.userContentController = wkUController;
        WKPreferences *preference = [[WKPreferences alloc]init];
        config.preferences = preference;
        _webView = [[YJBWebView alloc] initWithFrame:CGRectZero configuration:config];
        _webView.navigationDelegate = self;
        _webView.scrollView.bounces = NO;
        _webView.backgroundColor = [UIColor whiteColor];
        _webView.scrollView.contentInset = UIEdgeInsetsMake(10, 0, 0, 0);
    }
    return _webView;
}
- (YJBView *)bView{
    if (!_bView) {
        _bView = [[YJBView alloc] init];
    }
    return _bView;
}
@end
