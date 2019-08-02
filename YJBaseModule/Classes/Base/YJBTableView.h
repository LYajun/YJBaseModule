//
//  YJBTableView.h
//  Pods-YJBaseModule_Example
//
//  Created by 刘亚军 on 2019/8/1.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN
@protocol YJBTableViewRefreshDelegate <NSObject>
- (void)tableViewHeaderDidRefresh;
- (void)tableViewFooterDidRefresh;
- (void)tableViewAgainLoadData;
@end
@interface YJBTableView : UITableView
@property (nonatomic,assign) id<YJBTableViewRefreshDelegate> refreshDelegate;
- (void)installRefreshHeader:(BOOL)installHeader footer:(BOOL)installFooter;
- (void)endHeaderRefreshing;
- (void)endFooterRefreshing;
- (void)endFooterRefreshingWithNoMoreData;
- (void)resetFooterNoMoreData;

@end

NS_ASSUME_NONNULL_END
