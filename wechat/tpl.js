
var ejs = require('ejs');
var heredoc = require('heredoc');
var tpl = heredoc(function(){/*
    <xml> 
    <ToUserName><%=ToUserName %></ToUserName>
    <FromUserName><%=FromUserName %></FromUserName>
    <CreateTime><%=CreateTime %></CreateTime>
    <MsgType><%=MsgType %></MsgType>
    <%if(MsgType == 'text'){%>
    <Content><%=content %></Content>
    <%} else if(MsgType == 'image'){%>
    <Image>
    <MediaId><%=content.mediaId %></MediaId>
    </Image>
    <%} else if(MsgType == 'voice'){%>
    <Voice>
    <MediaId><%=content.mediaId%></MediaId>
    </Voice>
    <%} else if(MsgType == 'video'){%>
    <Video>
    <MediaId><%=content.mediaId%></MediaId>
    <Title><%=content.title %>></Title>
    <Description><%=content.description %>></Description>
    </Video>
    <%} else if(MsgType == 'music'){%>
    <Music>
    <Title><%=content.title %>></Title>
    <Description><%=content.description %></Description>
    <MusicUrl><%=content.MUSIC_Url %></MusicUrl>
    <HQMusicUrl><%=content.HQ_MUSIC_Url %></HQMusicUrl>
    <ThumbMediaId><%=content.mediaId %></ThumbMediaId>
    </Music>
    <%} else if(MsgType == 'news'){%>
    <ArticleCount><%=content.length %></ArticleCount>
    <Articles>
    <%content.forEach(function(item){ %>
        <item>
        <Title><%=item.title %>></Title>
        <Description><%=item.description %></Description>
        <PicUrl><%=item.picurl %></PicUrl>
        <Url><%=item.url %></Url>
        </item>
    <%}) %>
    </Articles>
    <%} %>
    </xml>`
*/})
var compiled = ejs.compile(tpl)
exports = module.exports = {
    compiled: compiled
}