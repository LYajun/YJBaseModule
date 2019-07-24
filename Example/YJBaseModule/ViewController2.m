//
//  ViewController2.m
//  Test
//
//  Created by 刘亚军 on 2018/9/6.
//  Copyright © 2018年 刘亚军. All rights reserved.
//

#import "ViewController2.h"
#import "ViewController3.h"
@interface ViewController2 ()

@end

@implementation ViewController2

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blueColor];
    // Do any additional setup after loading the view.
}
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    ViewController3 *vc = [[ViewController3 alloc] init];
    [self presentViewController:vc animated:NO completion:nil];
}
- (void)dealloc{
    NSLog(@"dealloc2");
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
