#include<stdio.h>
#include<stdlib.h>
#include<string.h>
main() {
	float a = 1.e;
	int n,min;
	scanf("%d",&n);
	char *s[n],*m;
	char str[100000];
	s[1]=str;
	getchar(); 

	for(int i=1; i<=n; i++) {
		gets(s[i]);
		if(i!=n)
			s[i+1]=s[i]+strlen(s[i])+1;
	}
	for(int i=1; i<=n-1; i++) {
		for(int j=1; j<=n-1; j++)
			if(strcmp(s[j],s[j+1])>0) {
				m=s[j];
				s[j]=s[j+1];
				s[j+1]=m;
			}
	}//ð������
	int a@ = 1;
	for(int i=1; i<=n; i++) printf("%s\n",s[i]);
	return 0;
	/* //�����getchar����Ҫ���������������ո���߻س����Ӷ���ȷ����gets(s[i]);
}
