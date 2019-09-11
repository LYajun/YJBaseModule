//
//  YJBWebView.m
//  YJBaseModule
//
//  Created by 刘亚军 on 2019/9/11.
//

#import "YJBWebView.h"
#import <YJExtensions/YJExtensions.h>


@implementation YJBWeakWebViewScriptMessageDelegate

- (instancetype)initWithDelegate:(id<WKScriptMessageHandler>)scriptDelegate {
    self = [super init];
    if (self) {
        _scriptDelegate = scriptDelegate;
    }
    return self;
}

#pragma mark - WKScriptMessageHandler
//遵循WKScriptMessageHandler协议，必须实现如下方法，然后把方法向外传递
//通过接收JS传出消息的name进行捕捉的回调方法
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    
    if ([self.scriptDelegate respondsToSelector:@selector(userContentController:didReceiveScriptMessage:)]) {
        [self.scriptDelegate userContentController:userContentController didReceiveScriptMessage:message];
    }
}
@end

@interface YJBWebView ()

@end
@implementation YJBWebView
- (void)yj_loadHTMLUrlString:(NSString *)urlString baseURL:(NSURL *)baseURL{
    __weak typeof(self) weakSelf = self;
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        NSURL *url = [NSURL URLWithString:[urlString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]]];
        
        NSStringEncoding * usedEncoding = nil;
        //带编码头的如 utf-8等 这里会识别
        NSString *body = [NSString stringWithContentsOfURL:url usedEncoding:usedEncoding error:nil];
        if (!body){
            //如果之前不能解码，现在使用GBK解码
            NSLog(@"GBK");
            body = [NSString stringWithContentsOfURL:url encoding:0x80000632 error:nil];
        }
        if (!body) {
            //再使用GB18030解码
            NSLog(@"GBK18030");
            body = [NSString stringWithContentsOfURL:url encoding:0x80000631 error:nil];
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (body) {
                [weakSelf yj_loadHTMLUrlString:body baseURL:baseURL];
            }else {
                NSLog(@"没有合适的编码");
                NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
                request.timeoutInterval = 15;
                [weakSelf loadRequest:request];
            }
        });
    });
}
- (void)yj_loadHTMLString:(NSString *)string baseURL:(NSURL *)baseURL{
    [self loadHTMLString:[NSString yj_adaptWebViewForHtml:string] baseURL:baseURL];
}


+ (NSArray *)yj_voiceAllFileExtension{
    return @[@"wav",@"mp3",@"pcm",@"amr",@"aac",@"caf"];
}
+ (NSArray *)yj_imageAllFileExtension{
    return @[@"png",@"jpg",@"gif"];
}

+ (BOOL)yj_isVoiceFileWithExtName:(NSString *)extName{
    BOOL isContain = NO;
    for (NSString *str in self.yj_voiceAllFileExtension) {
        if ([extName.lowercaseString containsString:str]) {
            isContain = YES;
            break;
        }
    }
    return isContain;
}
+ (BOOL)yj_isImgFileWithExtName:(NSString *)extName{
    BOOL isContain = NO;
    for (NSString *str in self.yj_imageAllFileExtension) {
        if ([extName.lowercaseString containsString:str]) {
            isContain = YES;
            break;
        }
    }
    return isContain;
}


- (void)yj_adjustTestSizeWithSizeRate:(NSString *)rate{
    NSString *str = [NSString stringWithFormat:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '%@'",rate];
    [self evaluateJavaScript:str completionHandler:^(id _Nullable  obj, NSError * _Nullable error) {
        if (error) {
            NSLog(@"字体设置失败:%@",error.localizedDescription);
        }
       
    }];
}
- (NSString *)yj_imgClickJSSrcPrefix{
    return @"image-preview";
}
- (void)yj_addImgClickJS{
    //这里是JS，主要目的: - 获取H5图片的url
    static  NSString * const jsGetImages =
    @"function getImages(){\
    var objs = document.getElementsByTagName(\"img\");\
    var imgScr = '';\
    for(var i=0;i<objs.length;i++){\
    imgScr = imgScr + objs[i].src + '+';\
    };\
    return imgScr;\
    };";
    
    [self evaluateJavaScript:jsGetImages completionHandler:^(id _Nullable result, NSError * _Nullable error) {
        if (error) {
            NSLog(@"jsGetImages 注入失败:%@",error.localizedDescription);
        }
    }];//注入JS方法
    
    //添加图片可点击JS
    [self evaluateJavaScript:@"function registerImageClickAction(){\
     var imgs=document.getElementsByTagName('img');\
     var length=imgs.length;\
     for(var i=0;i<length;i++){\
     img=imgs[i];\
     img.onclick=function(){\
     window.location.href='image-preview:'+this.src}\
     }\
     }" completionHandler:^(id _Nullable result, NSError * _Nullable error) {
         if (error) {
             NSLog(@"添加图片可点击JS 注入失败:%@",error.localizedDescription);
         }
     }];
    
    [self evaluateJavaScript:@"registerImageClickAction();"  completionHandler:^(id _Nullable result, NSError * _Nullable error) {
          if (error) {
              NSLog(@"registerImageClickAction 注入失败:%@",error.localizedDescription);
          }
    }];
}
- (void)yj_getImagesWithCompletionHandler:(void (^)(NSArray * _Nullable))completionHandler{
    static  NSString * const jsGetImages =
    @"function getImages(){\
    var objs = document.getElementsByTagName(\"img\");\
    var imgScr = '';\
    for(var i=0;i<objs.length;i++){\
    imgScr = imgScr + objs[i].src + '+';\
    };\
    return imgScr;\
    };";
    
    [self evaluateJavaScript:jsGetImages completionHandler:^(id _Nullable result, NSError * _Nullable error) {
        if (error) {
            NSLog(@"jsGetImages 注入失败:%@",error.localizedDescription);
        }
    }];//注入JS方法
    
    [self evaluateJavaScript:@"getImages()" completionHandler:^(id _Nullable result, NSError * _Nullable error) {
        NSArray * urlArray = nil;
        if (!error) {
            urlArray = result ? [result componentsSeparatedByString:@"***"]:nil;
            NSLog(@"urlArray = %@",urlArray);
        }
        if (completionHandler) {
            completionHandler(urlArray);
        }
    }];
}
@end
